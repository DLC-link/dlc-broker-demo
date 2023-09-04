import { ethers } from 'ethers';
import { abi as dlcBrokerABI } from '../abis/dlcBrokerABI';
import { abi as btcNftABI } from '../abis/btcNftABI';
import { EthereumNetworks } from '../networks/ethereumNetworks';
import { fetchVault } from '../store/vaultsSlice';
import store from '../store/store';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { vaultStatuses } from '../enums/VaultStatuses';
import {
    getVaultByUUID,
    mintNft,
} from '../blockchainFunctions/ethereumFunctions';

async function isVaultOwner(vaultUUID) {
    const currentAddress = store.getState().account.address;
    const vault = await getVaultByUUID(vaultUUID);
    const vaultOwner = vault.owner.toLowerCase();
    const isOwner = vaultOwner === currentAddress.toLowerCase();
    return isOwner;
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
            const adminWallet = new ethers.Wallet(
                process.env.REACT_APP_ADMIN_PRIVATE_KEY,
                ethereumProvider
            );

            dlcBrokerETH = new ethers.Contract(
                dlcBrokerAddress,
                dlcBrokerABI,
                ethereumProvider
            ).connect(adminWallet);

            btcNftETH = new ethers.Contract(
                btcNftAddress,
                btcNftABI,
                ethereumProvider
            );

            dlcBrokerETH.on('StatusUpdate', async (...args) => {
                const vaultUUID = args[1];
                const vaultStatus = args[2];
                const vaultTXHash = args[args.length - 1].transactionHash;

                const vaultOwner = await isVaultOwner(vaultUUID);

                if (!vaultOwner) return;

                store.dispatch(
                    fetchVault({
                        vaultUUID: vaultUUID,
                        vaultStatus: vaultStatus,
                        vaultTXHash: vaultTXHash,
                    })
                );
            });

            btcNftETH.on('Approval', (...args) => {
                const nftID = args[3].args.tokenId.toNumber();
                store.dispatch(
                    fetchVault({
                        nftID: nftID,
                        vaultStatus: 4,
                    })
                );
            });

            console.log('Starting Ethereum observer...');
        } catch (error) {
            console.error(error);
        }
    }
}
