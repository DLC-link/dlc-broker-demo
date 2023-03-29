/*global chrome*/

import React from 'react';
import {
    VStack,
    HStack,
    Collapse,
    SimpleGrid,
    ScaleFade,
} from '@chakra-ui/react';
import Card from './Cards/Card';
import InitialCard from './Cards/InitialCard';
import SetupVaultCard from './Cards/SetupVaultCard';
import { useSelector } from 'react-redux';
import { selectAllVaults } from '../store/vaultsSlice';

export default function VaultsGrid({ isLoading, isConnected, initialVaults }) {
    const vaults = useSelector(selectAllVaults);
    const filters = useSelector((state) => state.filters);
    const account = useSelector((state) => state.account);

    // This should be handled in a selector
    // A function that filters the vaults based on the filters
    const filteredVaults = vaults.filter((vault) => {
        const isOwnVault = account.address === vault.owner;
        return (
            (isOwnVault && filters.showMinted) ||
            (!isOwnVault && filters.showReceived)
        );
    });

    return (
        <>
            <Collapse in={isConnected}>
                <VStack justifyContent="center" alignContent="center">
                    <HStack></HStack>
                    <ScaleFade in={!isLoading}>
                        <SimpleGrid columns={[1, 4]} spacing={[0, 15]}>
                            <SetupVaultCard></SetupVaultCard>
                            {initialVaults?.map((vault, j) => (
                                <InitialCard
                                    key={j}
                                    vault={vault}
                                    creator={account.address}
                                ></InitialCard>
                            ))}
                            {filteredVaults?.map((vault, i) => (
                                <Card key={i} vaultUUID={vault.uuid}></Card>
                            ))}
                        </SimpleGrid>
                    </ScaleFade>
                </VStack>
            </Collapse>
        </>
    );
}
