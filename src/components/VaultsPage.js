import React, { useEffect, useState } from 'react';
import { Text, Collapse, VStack, IconButton, HStack } from '@chakra-ui/react';
import VaultsGrid from './VaultsGrid';
import Balance from './Balance';
import eventBus from '../utilities/eventBus';
import { RefreshOutlined } from '@mui/icons-material';
import Filters from './Filters';
import { useSelector, useDispatch } from 'react-redux';
import { fetchVaults, selectAllVaults } from '../store/vaultsSlice';

export default function VaultsPage() {
    const dispatch = useDispatch();
    const initialVaults = [];
    const vaults = useSelector(selectAllVaults);
    const vaultsStoreStatus = useSelector((state) => state.vaults.status);
    const isLoading = useSelector((state) => state.vaults.status === 'loading');
    const address = useSelector((state) => state.account.address);

    const handleVaultEvent = (event) => {
        switch (event.status) {
            case 'NotReady':
                initialVaults.shift();
                break;
            case 'Initialized':
                initialVaults.push(event.vaultContract);
                break;
            default:
                refreshVaultsTable(false);
                break;
        }
    };

    useEffect(() => {
        if (vaultsStoreStatus === 'idle' && vaults.length === 0 && address) {
            refreshVaultsTable(false);
        }
    }, [address, vaultsStoreStatus, vaults.length]);

    useEffect(() => {
        eventBus.on('vault-event', handleVaultEvent);
    }, [address]);

    const refreshVaultsTable = async (isManual) => {
        dispatch(fetchVaults(address));
    };

    return (
        <>
            <Collapse in={address}>
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
                    <Balance></Balance>
                    <Filters></Filters>
                </VStack>
                <VaultsGrid
                    isLoading={isLoading}
                    initialVaults={initialVaults}
                ></VaultsGrid>
            </Collapse>
        </>
    );
}
