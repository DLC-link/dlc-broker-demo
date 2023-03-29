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
    CircularProgress,
} from '@chakra-ui/react';
import { easyTruncateAddress } from '../../utilities/formatFunctions';
import Status from '../Status';
import { ActionButtons } from '../ActionButtons';
import { useState, useEffect } from 'react';
import { vaultStatuses } from '../../enums/VaultStatuses';
import { useSelector } from 'react-redux';
import { selectVaultByUUID } from '../../store/vaultsSlice';

export default function Card({ vaultUUID }) {
    const [action, setAction] = useState(undefined);
    const [isLoading, setLoading] = useState(false);
    const [isOwnVault, setIsOwnVault] = useState(true);
    const userAddress = useSelector((state) => state.account.address); // and this could be removed
    const vault = useSelector((state) => selectVaultByUUID(state, vaultUUID));

    useEffect(() => {
        if (vault && userAddress === vault.owner) {
            setIsOwnVault(true);
        } else {
            setIsOwnVault(false);
        }
    }, [userAddress, vault]);

    useEffect(() => {
        if (!vault) return;
        switch (vault.status) {
            case vaultStatuses.READY:
                setAction('lockVault');
                break;
            case vaultStatuses.NFTISSUED:
                setAction(
                    vault.isApproved
                        ? isOwnVault
                            ? 'closeVault'
                            : 'liquidateVault'
                        : 'approveVault'
                );
                break;
            case vaultStatuses.NOTREADY:
            case vaultStatuses.FUNDED:
            case vaultStatuses.PREREPAID:
            case vaultStatuses.PRELIQUIDATED:
                setAction('pendingVault');
                break;
            case vaultStatuses.REPAID:
            case vaultStatuses.LIQUIDATED:
                setAction('closedVault');
                break;
            default:
                break;
        }
    }, [vault, isOwnVault]);

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
                    bgGradient="linear(to-d, secondary1, secondary2)"
                    justifyContent="center"
                >
                    <VStack margin="15px">
                        <Flex>
                            <Status
                                status={vault.status}
                                isCreator={isOwnVault}
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
                                <>
                                    {!isLoading ? (
                                        <Image
                                            src={vault.nftImageURL}
                                            alt="NFT"
                                            margin="0px"
                                            shadow="dark-lg"
                                            boxSize="200px"
                                        ></Image>
                                    ) : (
                                        <VStack
                                            boxSize="200px"
                                            justifyContent="center"
                                        >
                                            <CircularProgress
                                                isIndeterminate
                                                size="100px"
                                                color="secondary1"
                                            />
                                        </VStack>
                                    )}
                                </>
                            ) : (
                                <Spacer margin="0px" height="200px"></Spacer>
                            )}
                        </Box>
                        {action !== undefined && (
                            <ActionButtons
                                action={action}
                                vault={vault}
                            ></ActionButtons>
                        )}
                    </VStack>
                </Flex>
            )}
        </>
    );
}
