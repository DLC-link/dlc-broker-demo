import { ethers } from 'ethers';
import { abi as dlcBrokerABI } from './abis/dlcBrokerABI';
import { abi as dlcManagerABI } from './abis/dlcManagerABI'
import eventBus from './EventBus';

function startEthObserver() {
  try {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const dlcBrokerETH = new ethers.Contract(
      process.env.REACT_APP_GOERLI_BROKER_CONTRACT_ADDRESS,
      dlcBrokerABI,
      signer
    );

    const dlcManagerETH = new ethers.Contract(
      process.env.REACT_APP_GOERLI_DLC_MANAGER_CONTRACT_ADDRESS,
      dlcManagerABI,
      signer
    );

    dlcBrokerETH.on('StatusUpdate', (...args) =>
      eventBus.dispatch('vault-event', {
        status: 'refresh',
        txId: args[args.length - 1].transactionHash,
      })
    );

    dlcBrokerETH.on('SetupVault', (...args) => {
      console.log('szetupojja');
      eventBus.dispatch('vault-event', {
        status: 'setup',
        txId: args[args.length - 1].transactionHash,
      });
    });

    dlcManagerETH.on('CreateDLC', (...args) => {
      eventBus.dispatch('vault-event', {
        status: 'created',
        txId: args[args.length - 1].transactionHash,
      });
    });

    dlcBrokerETH.on('MintBtcNft', (...args) =>
      eventBus.dispatch('vault-event', {
        status: 'minted',
        txId: args[args.length - 1].transactionHash,
        nftPage: 'https://testnets.opensea.io/account',
      })
    );

    dlcBrokerETH.on('BurnBtcNft', (...args) =>
      eventBus.dispatch('vault-event', {
        status: 'burned',
        txId: args[args.length - 1].transactionHash,
      })
    );
  } catch (error) {
    console.error(error);
  }
}

export default function startObserver() {
  startEthObserver();
}
