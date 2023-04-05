import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    mintedFilterChanged,
    receivedFilterChanged,
} from '../store/vaultsSlice';

import { Text, HStack, Flex, VStack, Switch } from '@chakra-ui/react';
import { selectFilters } from '../store/vaultsSlice';

export default function Filters() {
    const filters = useSelector(selectFilters);
    const dispatch = useDispatch();
    return (
        <>
            <VStack
                padding="10px"
                height="auto"
                width="350px"
                border="1px"
                borderRadius="lg"
                borderColor="white"
                shadow="dark-lg"
                justifyContent="center"
                align="left"
            >
                <HStack justify="space-between">
                    <Text
                        fontSize="small"
                        display="inline"
                        fontWeight="extrabold"
                        color="white"
                    >
                        Show vaults{' '}
                        <Text
                            fontSize="small"
                            fontWeight="extrabold"
                            as="span"
                            color="primary1"
                        >
                            created by me
                        </Text>
                    </Text>

                    <Switch
                        colorScheme="teal"
                        size="sm"
                        isChecked={filters.showMinted}
                        onChange={(e) =>
                            dispatch(mintedFilterChanged(e.target.checked))
                        }
                    />
                </HStack>
                <HStack justify="space-between">
                    <Text fontSize="small" fontWeight="extrabold" color="white">
                        Show vaults{' '}
                        <Text
                            fontSize="small"
                            fontWeight="extrabold"
                            as="span"
                            color="yellow"
                        >
                            NOT created by me
                        </Text>
                    </Text>
                    <Switch
                        colorScheme="teal"
                        size="sm"
                        isChecked={filters.showReceived}
                        onChange={(e) =>
                            dispatch(receivedFilterChanged(e.target.checked))
                        }
                    />
                </HStack>
            </VStack>
        </>
    );
}
