import { Collapse, HStack, IconButton, Text, VStack } from '@chakra-ui/react';
import { RefreshOutlined } from '@mui/icons-material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOnMount } from '../hooks/useOnMount';
import { fetchBitcoinValue } from '../store/externalDataSlice';
import { fetchVaults } from '../store/vaultsSlice';
import Balance from './Balance';
import Filters from './Filters';
import VaultsGrid from './VaultsGrid';

export default function VaultsPage() {
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.vaults.status === 'loading');
    const address = useSelector((state) => state.account.address);

    useOnMount(() => {
        refreshVaultsTable();
    });

    const refreshVaultsTable = async () => {
        dispatch(fetchVaults(address));
        dispatch(fetchBitcoinValue());
    };

    return (
        <>
            <Collapse in={address}>
                <VStack>
                    <HStack width={275}>
                        <IconButton
                            _hover={{
                                borderColor: 'accent',
                                color: 'accent',
                                transform: 'translateY(-2.5px)',
                            }}
                            variant="outline"
                            isLoading={isLoading}
                            marginLeft={0}
                            height="35px"
                            width="35px"
                            borderRadius="lg"
                            borderColor="white"
                            color="white"
                            icon={<RefreshOutlined color="inherit" />}
                            onClick={() => refreshVaultsTable(true)}
                        />
                        <Text fontSize="2xl" fontWeight="extrabold">
                            BITCOIN VAULTS
                        </Text>
                    </HStack>
                    <Balance />
                    <Filters />
                </VStack>
                <VaultsGrid isLoading={isLoading} />
            </Collapse>
        </>
    );
}
