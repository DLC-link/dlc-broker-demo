/*global chrome*/

import React from 'react';
import {
    VStack,
    HStack,
    Collapse,
    SimpleGrid,
    ScaleFade,
    border,
} from '@chakra-ui/react';
import Card from './Cards/Card';
import SetupVaultCard from './Cards/SetupVaultCard';
import { useSelector } from 'react-redux';
import { selectFilteredVaults } from '../store/vaultsSlice';
import { motion } from 'framer-motion';

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
                                <motion.div
                                    key={`${vault.uuid}${vault.status}${vault.isApproved}`}
                                    whileHover={{
                                        scale: 1.025,
                                        transition: { duration: 0.5 },
                                      }}
                                    initial={{ x: -300, border: '5px dashed rgba(255,255,255, 0.1)', borderRadius: '25px'}}
                                    animate={{ x: 0, border: '0px' }}
                                    exit={{ x: 300 }}
                                >
                                    <Card vaultUUID={vault.uuid}></Card>
                                </motion.div>
                            ))}
                        </SimpleGrid>
                    </ScaleFade>
                </VStack>
            </Collapse>
        </>
    );
}
