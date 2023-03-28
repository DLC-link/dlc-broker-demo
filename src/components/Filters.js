import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setShowReceived, setShowMinted } from '../store/filtersSlice';

import { Text, HStack, Flex, VStack, Switch } from '@chakra-ui/react';

export default function Filters() {
    const filters = useSelector((state) => state.filters);
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
                            color="secondary1"
                        >
                            created by me
                        </Text>
                    </Text>

                    <Switch
                        colorScheme="teal"
                        size="sm"
                        isChecked={filters.showMinted}
                        onChange={(e) =>
                            dispatch(setShowMinted(e.target.checked))
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
                            dispatch(setShowReceived(e.target.checked))
                        }
                    />
                </HStack>
            </VStack>
        </>
    );
}
