import { ethers } from 'ethers';
import { abi as dlcBrokerABI } from './abis/dlcBrokerABI';
import { abi as dlcManagerABI } from './abis/dlcManagerABI';
import { abi as btcNftABI } from './abis/btcNftABI';
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

    const btcNftETH = new ethers.Contract(process.env.REACT_APP_GOERLI_NFT_CONTRACT_ADDRESS, btcNftABI, signer);

    dlcBrokerETH.on('StatusUpdate', (...args) =>
      eventBus.dispatch('vault-event', {
        status: 'refresh',
        txId: args[args.length - 1].transactionHash,
        chain: 'ethereum'
      })
    );

    dlcBrokerETH.on('SetupVault', (...args) => {
      eventBus.dispatch('vault-event', {
        status: 'setup',
        txId: args[args.length - 1].transactionHash,
        chain: 'ethereum'
      });
    });

    dlcManagerETH.on('CreateDLC', (...args) => {
      eventBus.dispatch('vault-event', {
        status: 'created',
        txId: args[args.length - 1].transactionHash,
        chain: 'ethereum'
      });
    });

    dlcManagerETH.on('SetStatusFunded', (...args) => {
      eventBus.dispatch('vault-event', {
        status: 'funded',
        txId: args[args.length - 1].transactionHash,
        chain: 'ethereum'
      });
    });

    btcNftETH.on('Approval', (...args) => {
      eventBus.dispatch('vault-event', {
        status: 'approved',
        txId: args[args.length - 1].transactionHash,
        chain: 'ethereum'
      });
    });

    dlcBrokerETH.on('MintBtcNft', (...args) =>
      eventBus.dispatch('vault-event', {
        status: 'minted',
        txId: args[args.length - 1].transactionHash,
        chain: 'ethereum',
        nftPage: 'https://testnets.opensea.io/account',
      })
    );

    dlcBrokerETH.on('BurnBtcNft', (...args) =>
      eventBus.dispatch('vault-event', {
        status: 'burned',
        txId: args[args.length - 1].transactionHash,
        chain: 'ethereum'
      })
    );
  } catch (error) {
    console.error(error);
  }
}

export default function startObserver() {
  startEthObserver();
}
