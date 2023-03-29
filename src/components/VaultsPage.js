import React, { useEffect, useState } from 'react';
import { Text, Collapse, VStack, IconButton, HStack } from '@chakra-ui/react';
import VaultsGrid from './VaultsGrid';
import Balance from './Balance';
import eventBus from '../utilities/eventBus';
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
    const [initialVaults, setInitialVaults] = useState([]);
    const dispatch = useDispatch();
    const vaults = useSelector(selectAllVaults);
    const vaultsStoreStatus = useSelector((state) => state.vaults.status);
    const isLoading = useSelector((state) => state.vaults.status === 'loading');
    const accountAddress = useSelector((state) => state.account.address);

    useEffect(() => {
        if (vaultsStoreStatus === 'idle' && vaults.length === 0) {
            dispatch(fetchVaults(accountAddress));
        }
    }, [dispatch, accountAddress, vaultsStoreStatus, vaults.length]);

    useEffect(() => {
        if (isProviderSet === true) {
            // refreshVaultsTable();
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
                // refreshVaultsTable();
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

    const refreshVaultsTable = async (isManual) => {
        dispatch(fetchVaults(accountAddress));
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
                            isLoading={isLoading}
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
                    isLoading={isLoading}
                    isConnected={isConnected}
                    initialVaults={initialVaults}
                    bitcoinValue={bitcoinValue}
                ></VaultsGrid>
            </Collapse>
        </>
    );
}
