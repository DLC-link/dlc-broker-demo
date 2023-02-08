import { ethers } from 'ethers';
import { abi as dlcBrokerABI } from './abis/dlcBrokerABI';
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

    dlcBrokerETH.on('StatusUpdate', (...args) =>
      eventBus.dispatch('vault-event', {
        status: 'setup',
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
