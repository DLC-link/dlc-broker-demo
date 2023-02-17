import { ethers } from 'ethers';
import { abi as dlcBrokerABI } from './abis/dlcBrokerABI';
import { abi as dlcManagerABI } from './abis/dlcManagerABI';
import { abi as btcNftABI } from './abis/btcNftABI';
import eventBus from './utilities/eventBus';

function startEthObserver() {
  let userAddress;
  let vaultUUIDs = [];

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
    const signer = provider.getSigner();

    const dlcBrokerETH = new ethers.Contract(process.env.REACT_APP_GOERLI_DLC_BROKER_ADDRESS, dlcBrokerABI, signer);

    const dlcManagerETH = new ethers.Contract(process.env.REACT_APP_GOERLI_DLC_MANAGER_ADDRESS, dlcManagerABI, signer);

    const btcNftETH = new ethers.Contract(process.env.REACT_APP_GOERLI_BTC_NFT_ADDRESS, btcNftABI, signer);

    dlcBrokerETH.on('StatusUpdate', (...args) => {
      eventBus.dispatch('vault-event', {
        status: 'refresh',
        txId: args[args.length - 1].transactionHash,
        chain: 'ethereum',
      });
    });

    dlcBrokerETH.on('SetupVault', (...args) => {
      if (userAddress == args[4].toLowerCase()) {
        eventBus.dispatch('vault-event', {
          status: 'setup',
          txId: args[args.length - 1].transactionHash,
          chain: 'ethereum',
        });
      }
    });

    dlcManagerETH.on('CreateDLC', (...args) => {
      console.log('args');
      console.log(args);
      if (vaultUUIDs.includes(args[1])) {
        eventBus.dispatch('vault-event', {
          status: 'ready',
          txId: args[args.length - 1].transactionHash,
          chain: 'ethereum',
        });
      }
    });

    dlcManagerETH.on('SetStatusFunded', (...args) => {
      if (vaultUUIDs.includes(args[0])) {
        eventBus.dispatch('vault-event', {
          status: 'funded',
          txId: args[args.length - 1].transactionHash,
          chain: 'ethereum',
        });
      }
    });

    btcNftETH.on('Approval', (...args) => {
      if (userAddress == args[0].toLowerCase()) {
        eventBus.dispatch('vault-event', {
          status: 'approved',
          txId: args[args.length - 1].transactionHash,
          chain: 'ethereum',
        });
      }
    });

    dlcBrokerETH.on('MintBtcNft', (...args) => {
      if (vaultUUIDs.includes(args[0])) {
        eventBus.dispatch('vault-event', {
          status: 'minted',
          txId: args[args.length - 1].transactionHash,
          chain: 'ethereum',
          nftPage: 'https://testnets.opensea.io/account',
        });
      }
    });

    dlcBrokerETH.on('BurnBtcNft', (...args) => {
      if (vaultUUIDs.includes(args[0])) {
        eventBus.dispatch('vault-event', {
          status: 'burned',
          txId: args[args.length - 1].transactionHash,
          chain: 'ethereum',
        });
      }
    });

    dlcManagerETH.on('CloseDLC', (...args) => {
      if (vaultUUIDs.includes(args[0])) {
        eventBus.dispatch('loan-event', {
          status: 'closed',
          txId: args[args.length - 1].transactionHash,
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
