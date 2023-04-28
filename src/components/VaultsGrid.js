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

export default function VaultsGrid() {
    const filteredVaults = useSelector(selectFilteredVaults);
    const address = useSelector((state) => state.account.address);
    const isLoading = useSelector((state) => state.vaults.status === 'loading');

    return (
        <>
            <Collapse in={address}>
                <VStack justifyContent="center" alignContent="center">
                    <HStack></HStack>
                    <ScaleFade in={!isLoading}>
                        <SimpleGrid columns={[1, 4]} spacing={[0, 15]}>
                            <SetupVaultCard></SetupVaultCard>
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
