import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    mintedFilterChanged,
    receivedFilterChanged,
} from '../store/vaultsSlice';

import {
    Text,
    HStack,
    Flex,
    VStack,
    Switch,
    Collapse,
    Button,
} from '@chakra-ui/react';
import { selectFilters } from '../store/vaultsSlice';

export default function Filters() {
    const filters = useSelector(selectFilters);
    const dispatch = useDispatch();
    const [showFilters, setShowFilters] = useState(false);

    return (
        <>
            <Button
                variant={'outline'}
                width={'350px'}
                onClick={() => setShowFilters(!showFilters)}
            >
                SHOW FILTERS
            </Button>
            <Collapse in={showFilters}>
                <VStack
                    padding="15px"
                    height="auto"
                    width="350px"
                    border="1px"
                    borderRadius="lg"
                    borderColor="white"
                    shadow="dark-lg"
                    justifyContent="center"
                    alignItems="justify"
                >
                    <HStack justify="space-between">
                            <Text
                                fontSize="small"
                                fontWeight="extrabold"
                                as="span"
                                color="accent"
                            >
                                CREATED BY ME
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
                            <Text
                                fontSize="small"
                                fontWeight="extrabold"
                                as="span"
                                color='accent'
                            >
                                NOT CREATED BY ME
                            </Text>
                        <Switch
                            colorScheme="teal"
                            size="sm"
                            isChecked={filters.showReceived}
                            onChange={(e) =>
                                dispatch(
                                    receivedFilterChanged(e.target.checked)
                                )
                            }
                        />
                    </HStack>
                </VStack>
            </Collapse>
        </>
    );
}
