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
import { selectFilteredVaults } from '../store/vaultsSlice';

export default function VaultsGrid({ isLoading, isConnected, initialVaults }) {
    const account = useSelector((state) => state.account);
    const filteredVaults = useSelector(selectFilteredVaults);

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
