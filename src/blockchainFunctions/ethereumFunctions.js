import { ethers } from 'ethers';
import { abi as dlcBrokerABI } from '../abis/dlcBrokerABI';
import { abi as btcNftABI } from '../abis/btcNftABI';
import eventBus from '../utilities/eventBus';
import { formatAllVaults, formatVault } from '../utilities/vaultFormatter';
import { EthereumNetworks } from '../networks/ethereumNetworks';
import { login } from '../store/accountSlice';
import store from '../store/store';

let dlcBrokerETH;
let btcNftETH;
let currentEthereumNetwork;

async function initializeEthereumProviders() {
    if (!dlcBrokerETH || !btcNftETH) {
        await setEthereumProvider();
    }
}

export async function setEthereumProvider() {
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
        eventBus.dispatch('is-info-modal-open', { isInfoModalOpen: true });
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
        // TODO: remove this after proper store setup
        eventBus.dispatch('account-information', accountInformation);

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
            .then(() =>
                eventBus.dispatch('vault-event', {
                    status: 'Initialized',
                    vaultContract: vaultContract,
                })
            );
    } catch (error) {
        console.error(error);
    }
}

export async function getAllVaultsForAddress(address) {
    if (!dlcBrokerETH) {
        await setEthereumProvider();
    }
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
        btcNftETH.approve(dlcBrokerAddress, nftID).then((response) =>
            eventBus.dispatch('vault-event', {
                status: 'ApproveRequested',
                txId: response.hash,
                chain: 'ethereum',
            })
        );
    } catch (error) {
        console.error(error);
    }
}

export async function getApproved(nftID) {
    const { dlcBrokerAddress } = EthereumNetworks[currentEthereumNetwork];
    const approvedAddresses = await btcNftETH.getApproved(nftID);
    console.log(approvedAddresses);

    const approvedLowerCase = Array.isArray(approvedAddresses)
        ? approvedAddresses.map((address) => address.toLowerCase())
        : [approvedAddresses.toLowerCase()];
    const approved = approvedLowerCase.includes(dlcBrokerAddress.toLowerCase());
    return approved;
}

export async function getAllNFTsForAddress(address) {
    if (!btcNftETH) {
        await setEthereumProvider();
    }
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
    return imageURL;
}

export async function processNftIssuedVault(vault, nft) {
    if (vault.status === 'NftIssued') {
        vault.nftImageURL = await getNFTMetadata(nft.uri);
        vault.isApproved = await getApproved(vault.nftID);
        vault.originalDepositor = nft.originalDepositor.toLowerCase();
    }
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

export async function fetchVaultsAndNFTs(address) {
    await initializeEthereumProviders();
    const [vaults, NFTs] = await Promise.all([
        dlcBrokerETH.getAllVaultsForAddress(address),
        btcNftETH.getDLCNFTsByOwner(address),
    ]);
    return { vaults, NFTs };
}

async function getVaultByUUID(vaultContractUUID) {
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
            eventBus.dispatch('vault-event', {
                status: 'CloseRequested',
                txId: response.hash,
                chain: 'ethereum',
            })
        );
    } catch (error) {
        console.error(error);
    }
}
