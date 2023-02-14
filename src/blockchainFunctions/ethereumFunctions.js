import { ethers } from 'ethers';
import { abi as dlcBrokerABI } from '../abis/dlcBrokerABI';
import { abi as btcNftABI } from '../abis/btcNftABI';
import eventBus from '../EventBus';
import { formatAllVaults } from '../utilities/vaultFormatter';

let vaultManagerETH;
let nftManagerETH;

try {
  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  vaultManagerETH = new ethers.Contract(process.env.REACT_APP_GOERLI_BROKER_CONTRACT_ADDRESS, dlcBrokerABI, signer);
  nftManagerETH = new ethers.Contract(process.env.REACT_APP_GOERLI_NFT_CONTRACT_ADDRESS, btcNftABI, signer);
} catch (error) {
  console.error(error);
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
    eventBus.dispatch('account-information', accountInformation);
  } catch (error) {
    console.error(error);
  }
}

export async function setupVault(vaultContract) {
  try {
    vaultManagerETH
      .setupVault(vaultContract.BTCDeposit, vaultContract.emergencyRefundTime)
      .then(() => eventBus.dispatch('vault-event', { status: 'initialized', vaultContract: vaultContract }));
  } catch (error) {
    console.error(error);
  }
}

export async function getAllVaultAndNFTDataForAddress(address) {
  const [formattedVaults, NFTs] = await Promise.all([getAllVaultsForAddress(address), getAllNFTsForAddress(address)]);
  const NFTMetadataPromises = NFTs.map((NFT) => getNFTMetadata(NFT.uri));
  const NFTMetadata = await Promise.all(NFTMetadataPromises);

  console.log('NFTs: ');
  console.log(NFTs);

  console.log('Vaults: ');
  console.log(formattedVaults);

  NFTs.forEach((NFT, i) => {
    formattedVaults.forEach((vault) => {
      if (parseInt(NFT.id) == vault.raw.nftID) {
        vault.raw.nftImageURL = NFTMetadata[i];
      }
    });
  });
  return formattedVaults;
}

async function getAllVaultsForAddress(address) {
  let formattedVaults = [];
  try {
    const vaults = await vaultManagerETH.getAllVaultsForAddress(address);
    formattedVaults = formatAllVaults(vaults);
  } catch (error) {
    console.error(error);
  }
  return formattedVaults;
}

export async function approveNFTBurn(nftID) {
  try {
    nftManagerETH.approve(process.env.REACT_APP_GOERLI_BROKER_CONTRACT_ADDRESS, nftID).then((response) =>
      eventBus.dispatch('vault-event', {
        status: 'approve-requested',
        txId: response.hash,
        chain: 'ethereum'
      })
    );
  } catch (error) {
    console.error(error);
  }
}

export async function getApproved(nftID) {
  const approvedAddresses = await nftManagerETH.getApproved(nftID);
  const approved = approvedAddresses.includes(process.env.REACT_APP_GOERLI_BROKER_CONTRACT_ADDRESS);
  return approved;
}

async function getAllNFTsForAddress(address) {
  let NFTs = [];
  try {
    NFTs = await nftManagerETH.getDLCNFTsByOwner(address);
  } catch (error) {
    console.error(error);
  }
  return NFTs;
}

async function getNFTMetadata(nftURI) {
  let imageURL;
  const modifiedNftURI = nftURI.replace('ipfs://', 'https://nftstorage.link/ipfs/');
  try {
    const response = await fetch(modifiedNftURI);
    const metadata = await response.json();
    const imageURI = metadata.image;
    const modifiedImageURI = imageURI.replace('ipfs://', 'https://nftstorage.link/ipfs/');
    const image = await fetch(modifiedImageURI);
    imageURL = image.url;
  } catch (error) {
    console.error(error);
  }
  return imageURL;
}

async function getVaultByUUID(vaultContractUUID) {
  let vault;
  try {
    vault = await vaultManagerETH.getVaultByUUID(vaultContractUUID);
  } catch (error) {
    console.error(error);
  }
  return vault;
}

export async function closeVault(vaultContractUUID) {
  const vault = await getVaultByUUID(vaultContractUUID);
  const vaultID = vault.id;
  try {
    vaultManagerETH.closeVault(vaultID).then((response) =>
      eventBus.dispatch('vault-event', {
        status: 'close-requested',
        txId: response.hash,
        chain: 'ethereum'
      })
    );
  } catch (error) {
    console.error(error);
  }
}
