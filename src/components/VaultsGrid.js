/*global chrome*/

import React from 'react';
import {
    Flex,
    Collapse,
    SimpleGrid,
    ScaleFade,
    Tooltip,
    Button,
} from '@chakra-ui/react';
import Card from './Cards/Card';
import { useSelector } from 'react-redux';
import { useVaults } from '../hooks/useVaults';
import SetupVaultButton from './SetupVaultButton';
import { mintNft } from '../blockchainFunctions/ethereumFunctions';

export default function VaultsGrid() {
    const vaults = useVaults();
    const address = useSelector((state) => state.account.address);
    const isLoading = useSelector((state) => state.vaults.status === 'loading');

    return (
        <Collapse in={address}>
            <Flex justifyContent="center" alignContent="center">
                <ScaleFade in={!isLoading}>
                    <SimpleGrid
                        columns={[1, 2, 3]}
                        spacing={50}
                        paddingTop={150}
                        paddingBottom={150}
                        paddingLeft={50}
                        paddingRight={50}
                        rowGap={25}
                    >
                        <SetupVaultButton />
                        {vaults?.map((vault) => (
                            <Card
                                key={`${vault.uuid}${vault.status}`}
                                vault={vault}
                            />
                        ))}
                    </SimpleGrid>
                </ScaleFade>
            </Flex>
        </Collapse>
    );
}
