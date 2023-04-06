import { ethers } from 'ethers';
import { abi as dlcBrokerABI } from './abis/dlcBrokerABI';
import { abi as btcNftABI } from './abis/btcNftABI';
import eventBus from './utilities/eventBus';
import { vaultStatuses } from './enums/VaultStatuses';
import { EthereumNetworks } from './networks/ethereumNetworks';
import {
    vaultSetupRequested,
    vaultStatusChanged,
    fetchVaults,
} from './store/vaultsSlice';
import store from './store/store';

let userAddress;
let currentEthereumNetwork;
let vaultUUIDs = [];
const statusLookup = Object.values(vaultStatuses);

eventBus.on('account-information', (accountInformation) => {
    userAddress = accountInformation.address;
    currentEthereumNetwork = accountInformation.blockchain;
});

eventBus.on('vaults', (vaults) => {
    vaultUUIDs = [];
    vaults.forEach((vault) => {
        vaultUUIDs.push(vault.uuid);
    });
});

function logStatus(vaultUUID, vaultStatus, vaultOwner) {
    switch (vaultStatus) {
        case vaultStatuses.NONE:
            break;
        case vaultStatuses.NOTREADY:
            console.log(
                `%cVault setup for %c${vaultOwner} %c!`,
                'color: white',
                'color: turquoise',
                'color: white'
            );
            break;
        case vaultStatuses.READY:
            console.log(
                `%cVault %c${vaultUUID} %cis ready!`,
                'color: white',
                'color: turquoise',
                'color: white'
            );
            break;
        case vaultStatuses.FUNDED:
            console.log(
                `%cVault %c${vaultUUID} %cis funded!`,
                'color: white',
                'color: turquoise',
                'color: white'
            );
            break;
        case vaultStatuses.NFTISSUED:
            console.log(
                `%cNFT issued for vault %c${vaultUUID} %c!`,
                'color: white',
                'color: turquoise',
                'color: white'
            );
            break;
        case vaultStatuses.PREREPAID:
            console.log(
                `%cClosing vault %c${vaultUUID} %c!`,
                'color: white',
                'color: turquoise',
                'color: white'
            );
            break;
        case vaultStatuses.REPAID:
            console.log(
                `%cVault %c${vaultUUID} %cis closed!`,
                'color: white',
                'color: turquoise',
                'color: white'
            );
            break;
        case vaultStatuses.APPROVED:
            console.log(
                `%cBurning NFT of %c${vaultUUID} %cis approved!`,
                'color: white',
                'color: turquoise',
                'color: white'
            );
            break;
        default:
            console.log('Unknow status!');
            break;
    }
}

export function startEthObserver() {
    try {
        const { dlcBrokerAddress, btcNftAddress } =
            EthereumNetworks[currentEthereumNetwork];
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum);

        const dlcBrokerETH = new ethers.Contract(
            dlcBrokerAddress,
            dlcBrokerABI,
            provider
        );
        const btcNftETH = new ethers.Contract(
            btcNftAddress,
            btcNftABI,
            provider
        );

        console.log(
            'Starting Ethereum observer...',
            dlcBrokerAddress,
            btcNftAddress,
            vaultUUIDs,
            userAddress
        );

        dlcBrokerETH.on('StatusUpdate', (...args) => {
            const vaultUUID = args[1];
            const vaultStatus = statusLookup[args[2]];
            // TODO: we should only react to events for vaults we have in the store
            logStatus(vaultUUID, vaultStatus);
            // store.dispatch(vaultStatusChanged({ vaultUUID, vaultStatus }));
            // NOTE: for now we just fetch all vaults again
            store.dispatch(fetchVaults(userAddress));
            // if (vaultUUIDs.includes(vaultUUID)) {
            eventBus.dispatch('vault-event', {
                status: vaultStatus,
                txId: args[args.length - 1].transactionHash,
                chain: currentEthereumNetwork,
            });
            // }
        });

        btcNftETH.on('Approval', (...args) => {
            const vaultOwner = args[0].toLowerCase();
            if (userAddress === vaultOwner) {
                logStatus(undefined, vaultStatuses.APPROVED, vaultOwner);
                store.dispatch(fetchVaults(userAddress));
                eventBus.dispatch('vault-event', {
                    status: 'Approved',
                    txId: args[args.length - 1].transactionHash,
                    chain: currentEthereumNetwork,
                });
            }
        });
    } catch (error) {
        console.error(error);
    }
}
