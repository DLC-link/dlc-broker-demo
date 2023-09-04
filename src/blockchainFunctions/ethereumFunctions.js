import { ethers } from 'ethers';
import { abi as dlcBrokerABI } from '../abis/dlcBrokerABI';
import { abi as btcNftABI } from '../abis/btcNftABI';
import { formatAllVaults, formatVault } from '../utilities/vaultFormatter';
import { EthereumNetworks } from '../networks/ethereumNetworks';
import { login } from '../store/accountSlice';
import store from '../store/store';
import { vaultEventReceived, vaultSetupRequested } from '../store/vaultsSlice';
import { toggleInfoModalVisibility } from '../store/componentSlice';
import { ToastEvent } from '../components/CustomToast';
import { NFTStorage } from 'nft.storage';
import 'jimp';
import { Blob } from 'nft.storage';

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
        store.dispatch(
            vaultEventReceived({
                status: ToastEvent.CONNECTIONFAILED,
            })
        );
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
        store.dispatch(
            vaultEventReceived({
                status: ToastEvent.TRANSACTIONFAILED,
            })
        );
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
        store.dispatch(
            vaultEventReceived({
                status: ToastEvent.CONNECTIONFAILED,
            })
        );
    }
}

export async function setupVault(vaultContract) {
    try {
        dlcBrokerETH
            .setupVault(vaultContract.BTCDeposit, vaultContract.attestorCount, {
                gasLimit: 900000,
            })
            .then((response) => {
                store.dispatch(
                    vaultSetupRequested({
                        vaultContract,
                        txHash: response.hash,
                    })
                );
            });
    } catch (error) {
        store.dispatch(
            vaultEventReceived({
                status: ToastEvent.TRANSACTIONFAILED,
            })
        );
    }
}

export async function getAllVaultsForAddress() {
    const address = store.getState().account.address;

    let formattedVaults = [];
    try {
        const vaults = await dlcBrokerETH.getAllVaultsForAddress(address);
        formattedVaults = formatAllVaults(vaults);
    } catch (error) {
        store.dispatch(
            vaultEventReceived({
                status: ToastEvent.RETRIEVALFAILED,
            })
        );
    }
    return formattedVaults;
}

export async function approveNFTBurn(nftID) {
    const { dlcBrokerAddress } = EthereumNetworks[currentEthereumNetwork];
    try {
        btcNftETH.approve(dlcBrokerAddress, nftID).then((response) =>
            store.dispatch(
                vaultEventReceived({
                    txHash: response.hash,
                    status: ToastEvent.APPROVEREQUESTED,
                })
            )
        );
    } catch (error) {
        store.dispatch(
            vaultEventReceived({
                status: ToastEvent.TRANSACTIONFAILED,
            })
        );
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
        store.dispatch(
            vaultEventReceived({
                status: ToastEvent.RETRIEVALFAILED,
            })
        );
    }
    return NFTs;
}

export async function getNFTMetadata(nftURI) {
    let imageURL;
    try {
        const modifiedNftURI = nftURI.replace(
            'ipfs://',
            'https://nftstorage.link/ipfs/'
        );
        const nftStorageResponse = await fetch(modifiedNftURI);
        const nftMetadata = await nftStorageResponse.json();
        const nftImageURI = nftMetadata.image;
        const modifiedNftImageURI = nftImageURI.replace(
            'ipfs://',
            'https://nftstorage.link/ipfs/'
        );
        const image = await fetch(modifiedNftImageURI);
        imageURL = image.url;
    } catch (error) {
        console.error(error);
    }
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
        dlcBrokerETH
            .closeVault(vaultID, { gasLimit: 900000 })
            .then((response) =>
                store.dispatch(
                    vaultEventReceived({
                        txHash: response.hash,
                        status: 'CloseRequested',
                    })
                )
            );
    } catch (error) {
        store.dispatch(
            vaultEventReceived({
                status: ToastEvent.TRANSACTIONFAILED,
            })
        );
    }
}

async function mintBtcNft(uuid, metadata) {
    const { blockchain } = store.getState().account;
    try {
        const contractWithSigner = await getContactWithSigner(blockchain);
        await contractWithSigner.mintBtcNft(uuid, metadata.url.substring(7));
    } catch (error) {
        store.dispatch(
            vaultEventReceived({
                status: ToastEvent.TRANSACTIONFAILED,
            })
        );
    }
}

async function getContactWithSigner(blockchain) {
    const { ethereum } = window;
    try {
        const { dlcBrokerAddress } = EthereumNetworks[blockchain];

        const ethereumProvider = new ethers.providers.Web3Provider(ethereum);
        const adminWallet = new ethers.Wallet(
            process.env.REACT_APP_ADMIN_PRIVATE_KEY,
            ethereumProvider
        );

        dlcBrokerETH = new ethers.Contract(
            dlcBrokerAddress,
            dlcBrokerABI,
            ethereumProvider
        ).connect(adminWallet);
    } catch (error) {
        store.dispatch(
            vaultEventReceived({
                status: ToastEvent.CONNECTIONFAILED,
            })
        );
    }

    return dlcBrokerETH;
}

export async function mintNft(uuid) {
    const { Jimp } = window;

    const nftID = await btcNftETH.getNextMintId();
    const vault = await getVaultByUUID(uuid);
    console.log('Got next NFT ID as ' + nftID);

    const NFT_STORAGE_TOKEN = process.env.REACT_APP_NFT_STORAGE_TOKEN;
    const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

    const imageNumber = nftID % 72; // 72 is the number of unique pngs created so far, 0 - 71. 72 % 72 = 0.

    const fetchURL = `https://dlc-public-assets.s3.amazonaws.com/btc-nft-images/${imageNumber}.png`;

    const collateralInSats = vault.vaultCollateral.toLocaleString('en-US');

    const font = await Jimp.loadFont(
        'http://localhost:3000/fonts/open-sans-32-white/open-sans-32-white.fnt'
    );

    const nftImage = await Jimp.read(fetchURL);
    nftImage.print(
        font,
        0,
        0,
        {
            text: collateralInSats + ' sats',
            alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT,
            alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM,
        },
        512
    );
    const nftImageBuffer = await nftImage.getBufferAsync(Jimp.MIME_PNG);

    const nftImageBlob = new Blob([nftImageBuffer], { type: 'image/png' });

    const nftMetadata = await client.store({
        name: 'Native Bitcoin backed NFT',
        description: `This is an NFT which represents ${
            vault.vaultCollateral / 10 ** 8
        } of locked Bitcoin -- https://www.dlc.link`,
        image: nftImageBlob,
    });

    await mintBtcNft(uuid, nftMetadata);
}

// export interface DeploymentInfo {
//     network: string;
//     contract: {
//         name: string,
//         address: string,
//         signerAddress: string,
//         abi: string | ethers.ContractInterface,
//     };
// }

// async function fetchDeploymentInfo(contractName, subchain, version) {
//     const branch = process.env.BRANCH || 'master';
//     console.log(
//         `Fetching deployment info for ${contract} on ${subchain} from dlc-solidity/${branch}`
//     );
//     try {
//         const response = await fetch(
//             `https://raw.githubusercontent.com/DLC-link/dlc-solidity/${branch}/deploymentFiles/${subchain}/v${version}/${contract}.json`
//         );
//         return await response.json();
//     } catch (error) {
//         throw new Error(
//             `Could not fetch deployment info for ${contract} on ${subchain}`
//         );
//     }
// }

// /**
//  * A helper to read a file from a location on disk and return a File object.
//  * Note that this reads the entire file into memory and should not be used for
//  * very large files.
//  * @param {string} filePath the path to a file to store
//  * @returns {File} a File object containing the file content
//  */
// async function fileFromPath(filePath, nameToUse) {
//     const content = await
//     const type = mime.lookup(filePath);
//     return new File([content], path.basename(nameToUse), {
//         type: type || undefined,
//     });
// }
