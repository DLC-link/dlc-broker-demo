import { ethers } from 'ethers';
import { abi as dlcBrokerABI } from '../abis/dlcBrokerABI';
import { abi as btcNftABI } from '../abis/btcNftABI';
import { formatAllVaults, formatVault } from '../utilities/vaultFormatter';
import { EthereumNetworks } from '../networks/ethereumNetworks';
import { login } from '../store/accountSlice';
import store from '../store/store';
import { vaultEventReceived, vaultSetupRequested } from '../store/vaultsSlice';
import { toggleInfoModalVisibility } from '../store/componentSlice';

let dlcBrokerETH;
let btcNftETH;
let currentEthereumNetwork;

async function setEthereumProvider() {
    const { dlcBrokerAddress, btcNftAddress } =
        EthereumNetworks[currentEthereumNetwork];
    try {
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const { chainId } = await provider.getNetwork();
        if (chainId !== currentEthereumNetwork) {
            await changeEthereumNetwork();
        }
        dlcBrokerETH = new ethers.Contract(
            dlcBrokerAddress,
            dlcBrokerABI,
            signer
        );
        btcNftETH = new ethers.Contract(btcNftAddress, btcNftABI, signer);
    } catch (error) {
        console.error(error);
    }
}

async function changeEthereumNetwork() {
    const { ethereum } = window;
    const formattedChainId = '0x' + currentEthereumNetwork.toString(16);
    try {
        store.dispatch(toggleInfoModalVisibility(true));
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: formattedChainId }],
        });
        window.location.reload();
    } catch (error) {
        if (error.code === 4001) {
            window.location.reload();
        }
        console.error(error);
    }
}

export async function requestAndDispatchMetaMaskAccountInformation(blockchain) {
    try {
        const { ethereum } = window;
        if (!ethereum) {
            alert('Install MetaMask!');
            return;
        }
        const accounts = await ethereum.request({
            method: 'eth_requestAccounts',
        });
        const accountInformation = {
            walletType: 'metamask',
            address: accounts[0],
            blockchain,
        };
        currentEthereumNetwork = blockchain;

        await setEthereumProvider();

        store.dispatch(login(accountInformation));
    } catch (error) {
        console.error(error);
    }
}

export async function setupVault(vaultContract) {
    try {
        dlcBrokerETH
            .setupVault(
                vaultContract.BTCDeposit,
                vaultContract.emergencyRefundTime
            )
            .then((e) => {
                console.log(e);
                store.dispatch(vaultSetupRequested(vaultContract));
            });
    } catch (error) {
        console.error(error);
    }
}

export async function getAllVaultsForAddress() {
    const address = store.getState().account.address;

    let formattedVaults = [];
    try {
        const vaults = await dlcBrokerETH.getAllVaultsForAddress(address);
        formattedVaults = formatAllVaults(vaults);
    } catch (error) {
        console.error(error);
    }
    return formattedVaults;
}

export async function approveNFTBurn(nftID) {
    const { dlcBrokerAddress } = EthereumNetworks[currentEthereumNetwork];
    try {
        btcNftETH
            .approve(dlcBrokerAddress, nftID)
            .then((response) =>
                store.dispatch(
                    vaultEventReceived({
                        txHash: response.hash,
                        status: 'ApproveRequested',
                    })
                )
            );
    } catch (error) {
        console.error(error);
    }
}

export async function getApproved(nftID) {
    const { dlcBrokerAddress } = EthereumNetworks[currentEthereumNetwork];
    const approvedAddresses = await btcNftETH.getApproved(nftID);

    const approvedLowerCase = Array.isArray(approvedAddresses)
        ? approvedAddresses.map((address) => address.toLowerCase())
        : [approvedAddresses.toLowerCase()];
    const approved = approvedLowerCase.includes(dlcBrokerAddress.toLowerCase());
    return approved;
}

export async function getAllNFTsForAddress() {
    const address = store.getState().account.address;

    let NFTs = [];
    try {
        NFTs = await btcNftETH.getDLCNFTsByOwner(address);
    } catch (error) {
        console.error(error);
    }
    return NFTs;
}

export async function getNFTMetadata(nftURI) {
    let imageURL;
    const modifiedNftURI = nftURI.replace(
        'ipfs://',
        'https://nftstorage.link/ipfs/'
    );
    try {
        const response = await fetch(modifiedNftURI);
        const metadata = await response.json();
        const imageURI = metadata.image;
        const modifiedImageURI = imageURI.replace(
            'ipfs://',
            'https://nftstorage.link/ipfs/'
        );
        const image = await fetch(modifiedImageURI);
        imageURL = image.url;
    } catch (error) {
        console.error(error);
    }
    console.log('imageURL', imageURL)
    return imageURL;
}

export async function processNftIssuedVault(vault, nft) {
    vault.nftImageURL = await getNFTMetadata(nft.uri);
    vault.isApproved = await getApproved(vault.nftID);
    return vault;
}

export async function getVaultsForNFTs(NFTs, formattedVaults) {
    let nftVaults = [];
    try {
        nftVaults = await Promise.all(
            NFTs.map(async (nft) => {
                if (
                    formattedVaults.find((vault) => vault.uuid === nft.dlcUUID)
                ) {
                    return null;
                }
                const vault = await dlcBrokerETH.getVaultByUUID(nft.dlcUUID);
                const formattedVault = formatVault(vault);
                return processNftIssuedVault(formattedVault, nft);
            })
        );
    } catch (error) {
        console.error(error);
    }
    return nftVaults.filter((vault) => vault !== null);
}

export async function getVaultForNFT(nft, vault) {
    let formattedVault;

    try {
        const vault = await dlcBrokerETH.getVaultByUUID(nft.dlcUUID);
        formattedVault = formatVault(vault);
        return processNftIssuedVault(formattedVault, nft);
    } catch (error) {
        console.error(error);
    }
    return formattedVault;
}

export async function fetchVaultsAndNFTs() {
    const { address } = store.getState().account;

    const [vaults, NFTs] = await Promise.all([
        dlcBrokerETH.getAllVaultsForAddress(address),
        btcNftETH.getDLCNFTsByOwner(address),
    ]);
    return { vaults, NFTs };
}

export async function getVaultByUUID(vaultContractUUID) {
    let vault;
    try {
        vault = await dlcBrokerETH.getVaultByUUID(vaultContractUUID);
    } catch (error) {
        console.error(error);
    }
    return vault;
}

export async function closeVault(vaultContractUUID) {
    const vault = await getVaultByUUID(vaultContractUUID);
    const vaultID = vault.id;
    try {
        dlcBrokerETH.closeVault(vaultID).then((response) =>
            store.dispatch(vaultEventReceived({ txHash: response.hash, status: 'CloseRequested' }))
        );
    } catch (error) {
        console.error(error);
    }
}
