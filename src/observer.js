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
    const provider = new ethers.providers.WebSocketProvider(
      `wss://goerli.infura.io/ws/v3/${process.env.REACT_APP_INFURA_KEY}`
    );

    const dlcBrokerETH = new ethers.Contract(process.env.REACT_APP_GOERLI_DLC_BROKER_ADDRESS, dlcBrokerABI, provider);
    const dlcManagerETH = new ethers.Contract(
      process.env.REACT_APP_GOERLI_DLC_MANAGER_ADDRESS,
      dlcManagerABI,
      provider
    );
    const btcNftETH = new ethers.Contract(process.env.REACT_APP_GOERLI_BTC_NFT_ADDRESS, btcNftABI, provider);

    dlcBrokerETH.on('StatusUpdate', (...args) => {
      console.log('StatusUpdate');
      eventBus.dispatch('vault-event', {
        status: 'refresh',
        txId: args[args.length - 1].transactionHash,
        chain: 'ethereum',
      });
    });

    dlcBrokerETH.on('SetupVault', (...args) => {
      console.log('SetupVault');
      if (userAddress == args[4].toLowerCase()) {
        eventBus.dispatch('vault-event', {
          status: 'setup',
          txId: args[args.length - 1].transactionHash,
          chain: 'ethereum',
        });
      }
    });

    dlcManagerETH.on(
      'PostCreateDLC',
      async () => console.log('PostCreateDLC')
      // if (vaultUUIDs.includes(args[1])) {
      //   eventBus.dispatch('vault-event', {
      //     status: 'ready',
      //     txId: args[args.length - 1].transactionHash,
      //     chain: 'ethereum',
      //   });
      // }
    );

    dlcManagerETH.on('SetStatusFunded', (...args) => {
      console.log('SetStatusFunded');
      if (vaultUUIDs.includes(args[0])) {
        eventBus.dispatch('vault-event', {
          status: 'funded',
          txId: args[args.length - 1].transactionHash,
          chain: 'ethereum',
        });
      }
    });

    btcNftETH.on('Approval', (...args) => {
      console.log('Approval');
      if (userAddress == args[0].toLowerCase()) {
        eventBus.dispatch('vault-event', {
          status: 'approved',
          txId: args[args.length - 1].transactionHash,
          chain: 'ethereum',
        });
      }
    });

    dlcBrokerETH.on('MintBtcNft', (...args) => {
      console.log('MintBtcNft');
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
      console.log('BurnBtcNft');
      if (vaultUUIDs.includes(args[0])) {
        eventBus.dispatch('vault-event', {
          status: 'burned',
          txId: args[args.length - 1].transactionHash,
          chain: 'ethereum',
        });
      }
    });

    dlcManagerETH.on('PostCloseDLC', (...args) => {
      console.log('CloseDlc');
      if (vaultUUIDs.includes(args[0])) {
        eventBus.dispatch('vault-event', {
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
