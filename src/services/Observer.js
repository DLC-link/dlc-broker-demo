import { ethers } from 'ethers';
import { abi as dlcBrokerABI } from '../abis/dlcBrokerABI';
import { abi as btcNftABI } from '../abis/btcNftABI';
import eventBus from '../utilities/eventBus';
import { vaultStatuses } from '../enums/VaultStatuses';
import { EthereumNetworks } from '../networks/ethereumNetworks';
import { fetchVault } from '../store/vaultsSlice';
import store from '../store/store';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

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

export default function Observer() {
    const address = useSelector((state) => state.account.address);
    const blockchain = useSelector((state) => state.account.blockchain);

    let ethereumProvider;

    let dlcBrokerETH;
    let btcNftETH;

    useEffect(() => {
        if (address && blockchain) {
            startEthereumObserver();
        }
    }, [address, blockchain]);

    function startEthereumObserver() {
        try {
            const { dlcBrokerAddress, btcNftAddress } =
                EthereumNetworks[blockchain];
            const { ethereum } = window;

            ethereumProvider = new ethers.providers.Web3Provider(ethereum);

            dlcBrokerETH = new ethers.Contract(
                dlcBrokerAddress,
                dlcBrokerABI,
                ethereumProvider
            );
            btcNftETH = new ethers.Contract(
                btcNftAddress,
                btcNftABI,
                ethereumProvider
            );

            dlcBrokerETH.on('StatusUpdate', async (...args) => {
                const vaultUUID = args[1];
                const vaultStatus = args[2];
console.log('StatusUpdate', vaultUUID, vaultStatus);
                store.dispatch(
                    fetchVault({
                        vaultUUID: vaultUUID,
                        vaultStatus: vaultStatus,
                    })
                );
            });

            btcNftETH.on('Approval', (...args) => {
                const vaultOwner = args[0].toLowerCase();
                const vaultUUID = args[1];
                const vaultStatus = args[2];

                if (address === vaultOwner) {
                    store.dispatch(
                        fetchVault({
                            vaultUUID: vaultUUID,
                            vaultStatus: vaultStatus,
                        })
                    );
                }
            });

            console.log('Starting Ethereum observer...');
        } catch (error) {
            console.error(error);
        }
    }
}
