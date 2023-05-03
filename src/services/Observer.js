import { ethers } from 'ethers';
import { abi as dlcBrokerABI } from '../abis/dlcBrokerABI';
import { abi as btcNftABI } from '../abis/btcNftABI';
import { EthereumNetworks } from '../networks/ethereumNetworks';
import { fetchVault } from '../store/vaultsSlice';
import store from '../store/store';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

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
                const vaultTXHash = args[args.length - 1].transactionHash;

                store.dispatch(
                    fetchVault({
                        vaultUUID: vaultUUID,
                        vaultStatus: vaultStatus,
                        vaultTXHash: vaultTXHash,
                    })
                );
            });

            btcNftETH.on('Approval', (...args) => {
                const vaultOwner = args[0].toLowerCase();
                const vaultUUID = args[1];
                const vaultStatus = args[2];
                const vaultTXHash = args[args.length - 1].transactionHash;

                if (address === vaultOwner) {
                    store.dispatch(
                        fetchVault({
                            vaultUUID: vaultUUID,
                            vaultStatus: vaultStatus,
                            vaultTXHash: vaultTXHash,
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
