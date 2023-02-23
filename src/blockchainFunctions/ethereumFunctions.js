import { ethers } from 'ethers';
import { abi as dlcBrokerABI } from '../abis/dlcBrokerABI';
import { abi as btcNftABI } from '../abis/btcNftABI';
import eventBus from '../utilities/eventBus';
import { formatAllVaults } from '../utilities/vaultFormatter';

let dlcBrokerETH;
let btcNftETH;

export async function setEthereumProvider() {
  try {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    dlcBrokerETH = new ethers.Contract(process.env.REACT_APP_GOERLI_DLC_BROKER_ADDRESS, dlcBrokerABI, signer);
    btcNftETH = new ethers.Contract(process.env.REACT_APP_GOERLI_BTC_NFT_ADDRESS, btcNftABI, signer);
  } catch (error) {
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
    eventBus.dispatch('account-information', accountInformation);
  } catch (error) {
    console.error(error);
  }
}

export async function setupVault(vaultContract) {
  try {
    dlcBrokerETH
      .setupVault(vaultContract.BTCDeposit, vaultContract.emergencyRefundTime)
      .then(() => eventBus.dispatch('vault-event', { status: 'Initialized', vaultContract: vaultContract }));
  } catch (error) {
    console.error(error);
  }
}

export async function getAllVaultsForAddress(address) {
  let formattedVaults = [];
  try {
    const vaults = await dlcBrokerETH.getAllVaultsForAddress(address);

    console.log('Vaults:', vaults);

    formattedVaults = formatAllVaults(vaults);
  } catch (error) {
    console.error(error);
  }
  return formattedVaults;
}

export async function approveNFTBurn(nftID) {
  try {
    btcNftETH.approve(process.env.REACT_APP_GOERLI_DLC_BROKER_ADDRESS, nftID).then((response) =>
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
  const approvedAddresses = await btcNftETH.getApproved(nftID);
  const approved = approvedAddresses.includes(process.env.REACT_APP_GOERLI_DLC_BROKER_ADDRESS);
  return approved;
}

export async function getAllNFTsForAddress(address) {
  let NFTs = [];
  try {
    NFTs = await btcNftETH.getDLCNFTsByOwner(address);
    console.log('NFTs:', NFTs);
  } catch (error) {
    console.error(error);
  }
  return NFTs;
}

export async function getNFTMetadata(nftURI) {
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
    if (error.response.status === 504) {
      getNFTMetadata(nftURI);
    } else {
      console.error(error);
    }
  }
  return imageURL;
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
