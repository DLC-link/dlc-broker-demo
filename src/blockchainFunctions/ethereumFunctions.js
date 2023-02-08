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
    vaultManagerETH.setupVault(vaultContract.BTCDeposit, vaultContract.emergencyRefundTime);
  } catch (error) {
    console.error(error);
  }
}

export async function getAllVaultAndNFTDataForAddress(address) {
  const [vaults, NFTs] = await Promise.all([getAllVaultsForAddress(address), getAllNFTsForAddress(address)]);
  const NFTMetadataPromises = NFTs.map((NFT) => getNFTMetadata(NFT.uri));
  const NFTMetadata = await Promise.all(NFTMetadataPromises);
  vaults.forEach((vault, i) => {
    NFTs.forEach((NFT) => {
      if (NFT.id === vault.nftId) {
        vault.nftImageURL = NFTMetadata[i].url;
      }
    });
  });
  const formattedVaults = formatAllVaults(vaults);
  return formattedVaults;
}

async function getAllVaultsForAddress(address) {
  let vaults = [];
  try {
    vaults = await vaultManagerETH.getAllVaultsForAddress(address);
  } catch (error) {
    console.error(error);
  }
  console.log(vaults);
  return vaults;
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
  let NFTMetadata;
  const modifiedNftURI = nftURI.replace('ipfs://', 'https://nftstorage.link/ipfs/');
  try {
    NFTMetadata = await fetch(modifiedNftURI);
  } catch (error) {
    console.error(error);
  }
  return NFTMetadata;
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
        status: 'repay-requested',
        txId: response.hash,
      })
    );
  } catch (error) {
    console.error(error);
  }
}
