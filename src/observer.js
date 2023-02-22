import { ethers } from 'ethers';
import { abi as dlcBrokerABI } from './abis/dlcBrokerABI';
import { abi as dlcManagerABI } from './abis/dlcManagerABI';
import { abi as btcNftABI } from './abis/btcNftABI';
import eventBus from './utilities/eventBus';
import { countdown } from './utilities/calculationFunctions';

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

    const dlcBrokerETH = new ethers.Contract(process.env.REACT_APP_GOERLI_DLC_BROKER_ADDRESS, dlcBrokerABI, provider);
    const dlcManagerETH = new ethers.Contract(
      process.env.REACT_APP_GOERLI_DLC_MANAGER_ADDRESS,
      dlcManagerABI,
      provider
    );
    const btcNftETH = new ethers.Contract(process.env.REACT_APP_GOERLI_BTC_NFT_ADDRESS, btcNftABI, provider);

    dlcBrokerETH.on('StatusUpdate', (...args) => {
      if (vaultUUIDs.includes(args[1]) && [2, 6].includes(args[2])) {
        console.log('Updating status in:');
        countdown(15);
        setTimeout(
          () =>
            eventBus.dispatch('vault-event', {
              status: 'refresh',
              txId: args[args.length - 1].transactionHash,
              chain: 'ethereum',
            }),
          20000
        );
      }
    });

    dlcBrokerETH.on('SetupVault', async (...args) => {
      if (userAddress === args[4].toLowerCase()) {
        console.log(`%cVault will be setup for %c${args[4]} %cin:`, 'color: white', 'color: turquoise', 'color: white');
        countdown(10);
        setTimeout(
          () =>
            eventBus.dispatch('vault-event', {
              status: 'setup',
              txId: args[args.length - 1].transactionHash,
              chain: 'ethereum',
            }),
          15000
        );
      }
    });

    dlcManagerETH.on('SetStatusFunded', (...args) => {
      if (vaultUUIDs.includes(args[0])) {
        console.log(`%cVault %c${args[0]} %cis funded!`, 'color: white', 'color: turquoise', 'color: white');
        eventBus.dispatch('vault-event', {
          status: 'funded',
          txId: args[args.length - 1].transactionHash,
          chain: 'ethereum',
        });
      }
    });

    btcNftETH.on('Approval', (...args) => {
      if (userAddress === args[0].toLowerCase()) {
        console.log(`%cVault %c${args[0]} %cis approved!`, 'color: white', 'color: turquoise', 'color: white');
        eventBus.dispatch('vault-event', {
          status: 'approved',
          txId: args[args.length - 1].transactionHash,
          chain: 'ethereum',
        });
      }
    });

    dlcBrokerETH.on('MintBtcNft', (...args) => {
      if (vaultUUIDs.includes(args[0])) {
        console.log(`%cMinting NFT for vault %c${args[0]} %cin:`, 'color: white', 'color: turquoise', 'color: white');
        countdown(60);
        setTimeout(() => {
          eventBus.dispatch('vault-event', {
            status: 'minted',
            txId: args[args.length - 1].transactionHash,
            chain: 'ethereum',
            nftPage: 'https://testnets.opensea.io/account',
          });
        }, 65000);
      }
    });

    dlcBrokerETH.on('BurnBtcNft', (...args) => {
      if (vaultUUIDs.includes(args[0])) {
        console.log(`%cNFT of vault %c${args[0]} %cis burned!`, 'color: white', 'color: turquoise', 'color: white');
        eventBus.dispatch('vault-event', {
          status: 'burned',
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
