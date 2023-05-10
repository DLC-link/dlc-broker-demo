/*global chrome*/

import {
    Flex,
    Text,
    VStack,
    TableContainer,
    Tbody,
    Table,
    Tr,
    Td,
    Image,
    Box,
    Spacer,
} from '@chakra-ui/react';
import { easyTruncateAddress } from '../../utilities/formatFunctions';
import Status from '../Status';
import { ActionButtons } from '../ActionButtons';
import { useSelector } from 'react-redux';
import { selectVaultByUUID } from '../../store/vaultsSlice';
import { Container, chakra, shouldForwardProp } from '@chakra-ui/react';
import { motion, isValidMotionProp, motionValue, animate } from 'framer-motion';
import { useEffect } from 'react';

export default function Card({ vaultUUID }) {
    const vault = useSelector((state) => selectVaultByUUID(state, vaultUUID));

    const backgroundColor = vault.isUserCreated
        ? 'linear(to-br, background1, transparent)'
        : 'linear(to-br, background2, transparent)';

    return (
        <>
            {vault && (
                <Flex
                    marginTop="25px"
                    marginBottom="25px"
                    marginLeft="15px"
                    marginRight="15px"
                    height="450px"
                    width="250px"
                    borderRadius="lg"
                    shadow="dark-lg"
                    backgroundPosition="right"
                    backgroundSize={'200%'}
                    transition= 'background-position 500ms ease'
                    bgGradient={backgroundColor}
                    justifyContent="center"
                    _hover={{
                        backgroundPosition: 'left',
                    }}
                >
                    <VStack margin="15px">
                        <Flex>
                            <Status
                                status={vault.status}
                                isCreator={vault.isUserCreated}
                            ></Status>
                        </Flex>
                        <TableContainer>
                            <Table variant="unstyled" size="sm">
                                <Tbody>
                                    <Tr>
                                        <Td>
                                            <Text variant="property">UUID</Text>
                                        </Td>
                                        <Td>
                                            <Text>
                                                {easyTruncateAddress(
                                                    vault.uuid
                                                )}
                                            </Text>
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Td>
                                            <Text variant="property">
                                                Creator
                                            </Text>
                                        </Td>
                                        <Td>
                                            <Text>
                                                {easyTruncateAddress(
                                                    vault.owner
                                                )}
                                            </Text>
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Td>
                                            <Text variant="property">
                                                Vault Collateral
                                            </Text>
                                        </Td>
                                        <Td>
                                            <Text>
                                                {vault.formattedCollateral}
                                            </Text>
                                        </Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </TableContainer>
                        <Box padding="5px">
                            {vault.status === 'NftIssued' ? (
                                <Image
                                    src={vault.nftImageURL}
                                    alt="NFT"
                                    margin="0px"
                                    shadow="dark-lg"
                                    boxSize="200px"
                                ></Image>
                            ) : (
                                <Spacer margin="0px" height="200px"></Spacer>
                            )}
                        </Box>

                        <ActionButtons vaultUUID={vaultUUID}></ActionButtons>
                    </VStack>
                </Flex>
            )}
        </>
    );
}
