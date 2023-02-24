import { ethers } from 'ethers';
import { abi as dlcBrokerABI } from './abis/dlcBrokerABI';
import { abi as dlcManagerABI } from './abis/dlcManagerABI';
import { abi as btcNftABI } from './abis/btcNftABI';
import eventBus from './utilities/eventBus';
import { vaultStatuses } from './enums/VaultStatuses';

function startEthObserver() {
  let userAddress;
  let vaultUUIDs = [];

  function logStatus(vaultUUID, vaultStatus, vaultOwner) {
    switch (vaultStatus) {
      case 'None':
        break;
      case 'NotReady':
        console.log(`%cVault setup for %c${vaultOwner} %c!`, 'color: white', 'color: turquoise', 'color: white');
        break;
      case 'Ready':
        console.log(`%cVault %c${vaultUUID} %cis ready!`, 'color: white', 'color: turquoise', 'color: white');
        break;
      case 'Funded':
        console.log(`%cVault %c${vaultUUID} %cis funded!`, 'color: white', 'color: turquoise', 'color: white');
        break;
      case 'NftIssued':
        console.log(`%cVault %c${vaultUUID} %cis approved!`, 'color: white', 'color: turquoise', 'color: white');
        break;
      case 'PreRepaid':
        console.log(`%cClosing vault %c${vaultUUID} %c!`, 'color: white', 'color: turquoise', 'color: white');
        break;
      case 'Repaid':
        console.log(`%cVault %c${vaultUUID} %cis closed!`, 'color: white', 'color: turquoise', 'color: white');
        break;
      default:
        console.log('Unknow status!');
        break;
    }
  }

  eventBus.on('account-information', (accountInformation) => {
    userAddress = accountInformation.address;
  });

  eventBus.on('vaults', (vaults) => {
    vaultUUIDs = [];
    vaults.forEach((vault) => {
      vaultUUIDs.push(vault.raw.uuid);
    });
  });

  try {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);

    const dlcBrokerETH = new ethers.Contract(process.env.REACT_APP_SEPOLIA_DLC_BROKER_ADDRESS, dlcBrokerABI, provider);
    const btcNftETH = new ethers.Contract(process.env.REACT_APP_SEPOLIA_BTC_NFT_ADDRESS, btcNftABI, provider);

    dlcBrokerETH.on('StatusUpdate', (...args) => {
      const vaultUUID = args[1];
      const vaultStatus = vaultStatuses[args[2]];
      if (vaultUUIDs.includes(vaultUUID)) {
        logStatus(vaultUUID, vaultStatus);
        eventBus.dispatch('vault-event', {
          status: vaultStatus,
          txId: args[args.length - 1].transactionHash,
          chain: 'ethereum',
        });
      }
    });

    dlcBrokerETH.on('SetupVault', async (...args) => {
      const vaultOwner = args[4].toLowerCase();
      if (userAddress === vaultOwner) {
        logStatus(undefined, undefined, vaultOwner);
        eventBus.dispatch('vault-event', {
          status: 'NotReady',
          txId: args[args.length - 1].transactionHash,
          chain: 'ethereum',
        });
      }
    });

    btcNftETH.on('Approval', (...args) => {
      const vaultOwner = args[0].toLowerCase();
      if (userAddress === vaultOwner) {
        logStatus(undefined, undefined, vaultOwner);
        eventBus.dispatch('vault-event', {
          status: 'Approved',
          txId: args[args.length - 1].transactionHash,
          chain: 'ethereum',
        });
      }
    });
  } catch (error) {
    console.error(error);
  }
}

export default function startObserver() {
  startEthObserver();
}
