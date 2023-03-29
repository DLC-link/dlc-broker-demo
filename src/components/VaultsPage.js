import React, { useEffect, useState } from 'react';
import { Text, Collapse, VStack, IconButton, HStack } from '@chakra-ui/react';
import VaultsGrid from './VaultsGrid';
import Balance from './Balance';
import eventBus from '../utilities/eventBus';
import {
    getAllNFTsForAddress,
    getAllVaultsForAddress,
    getVaultsForNFTs,
} from '../blockchainFunctions/ethereumFunctions';
import { fetchBitcoinPrice } from '../blockchainFunctions/bitcoinFunctions';
import { RefreshOutlined } from '@mui/icons-material';
import Filters from './Filters';
import { useSelector, useDispatch } from 'react-redux';
import { fetchVaults, selectAllVaults } from '../store/vaultsSlice';

export default function VaultsPage({
    isConnected,
    isProviderSet,
    address,
    walletType,
    blockchain,
}) {
    const [bitcoinValue, setBitcoinValue] = useState(0);
    const [isLoading, setLoading] = useState([false, false]);
    const [initialVaults, setInitialVaults] = useState([]);
    const [vaults, setVaults] = useState([]);
    const [NFTs, setNFTs] = useState([]);
    const dispatch = useDispatch();
    const vaultsStoreVaults = useSelector(selectAllVaults);
    const vaultsStoreStatus = useSelector((state) => state.vaults.status);
    const accountAddress = useSelector((state) => state.account.address);

    //For example, rather than just connecting a <UserList> component and reading the entire array of users, have <UserList> retrieve a list of all user IDs, render list items as <UserListItem userId={userId}>, and have <UserListItem> be connected and extract its own user entry from the store. NOTE: making access granular would be best
    useEffect(() => {
        if (vaultsStoreStatus === 'idle' && vaultsStoreVaults.length === 0) {
            dispatch(fetchVaults(accountAddress));
        }
    }, [dispatch, accountAddress, vaultsStoreStatus, vaultsStoreVaults.length]);

    useEffect(() => {
        if (isProviderSet === true) {
            refreshVaultsTable();
        }

        const handleVaultEvent = (event) => {
            switch (event.status) {
                case 'NotReady':
                    initialVaults.shift();
                    break;
                case 'Initialized':
                    initialVaults.push(event.vaultContract);
                    break;
                default:
                    break;
            }
            if (isProviderSet === true) {
                refreshVaultsTable();
            }
        };

        const fetchData = async () => {
            try {
                const bitcoinPrice = await fetchBitcoinPrice();
                setBitcoinValue(bitcoinPrice);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
        eventBus.on('vault-event', handleVaultEvent);
    }, [isProviderSet]);

    const fetchAllVaultsAndNFTs = async () => {
        let vaults = [];
        let NFTs = [];
        switch (walletType) {
            case 'metamask':
                vaults = await getAllVaultsForAddress(address);
                NFTs = await getAllNFTsForAddress(address);
                console.log('Vaults: ', vaults);
                console.log('NFTs: ', NFTs);
                break;
            default:
                console.error('Unsupported wallet type!');
                break;
        }

        // Based on dlcUUIds in the NFTs, we have to also get the corresponding vaults
        let nftVaults = await getVaultsForNFTs(NFTs, vaults);

        // if we don't own the underlying NFT, we don't want to show the vault, unless it is closed or before minting
        vaults = vaults.filter(
            (vault) =>
                NFTs.find((nft) => nft.dlcUUID === vault.uuid) ||
                [
                    'NotReady',
                    'Ready',
                    'Funded',
                    'Closed',
                    'Liquidated',
                ].includes(vault.status)
        );

        let allRedeemable = nftVaults.length
            ? [...vaults, ...nftVaults]
            : vaults;

        eventBus.dispatch('vaults', allRedeemable);

        let sortedRedeemable = allRedeemable.sort((a, b) => a.id - b.id);

        return { sortedRedeemable, NFTs };
    };

    const refreshVaultsTable = async (isManual) => {
        setLoading([true, isManual]);
        fetchAllVaultsAndNFTs()
            .then(({ sortedRedeemable, NFTs }) => {
                setVaults(sortedRedeemable);
                setNFTs(NFTs);
            })
            .then(() => {
                setLoading(false, false);
            });
    };

    return (
        <>
            <Collapse in={isConnected}>
                <VStack marginBottom="50px">
                    <HStack justifyContent="center">
                        <IconButton
                            _hover={{
                                borderColor: 'accent',
                                color: 'accent',
                                transform: 'translateY(-2.5px)',
                            }}
                            variant="outline"
                            isLoading={isLoading[0] && isLoading[1]}
                            marginLeft="0px"
                            height="35px"
                            width="35px"
                            borderRadius="lg"
                            borderColor="white"
                            color="white"
                            icon={
                                <RefreshOutlined color="inherit"></RefreshOutlined>
                            }
                            onClick={() => refreshVaultsTable(true)}
                        ></IconButton>
                        <Text fontSize="3xl" fontWeight="extrabold">
                            BITCOIN VAULTS
                        </Text>
                    </HStack>
                    <Balance isConnected={isConnected}></Balance>
                    <Filters></Filters>
                </VStack>
                <VaultsGrid
                    isLoading={isLoading[0]}
                    isConnected={isConnected}
                    walletType={walletType}
                    address={address}
                    blockchain={blockchain}
                    initialVaults={initialVaults}
                    // vaults={vaultsStore.vaults} //TODO: this would be ideal
                    vaults={vaults}
                    NFTs={NFTs}
                    bitcoinValue={bitcoinValue}
                ></VaultsGrid>
            </Collapse>
        </>
    );
}
