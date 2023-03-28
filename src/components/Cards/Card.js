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
import {
    getApproved,
    getNFTMetadata,
} from '../../blockchainFunctions/ethereumFunctions';
import { vaultStatuses } from '../../enums/VaultStatuses';
import { useSelector } from 'react-redux';

export default function Card({ vault, NFTs, status }) {
    const [action, setAction] = useState(undefined);
    const [isLoading, setLoading] = useState(false);
    const [isOwnVault, setIsOwnVault] = useState(true);
    const account = useSelector((state) => state.account);

    useEffect(() => {
        if (account.address === vault.raw.owner) {
            setIsOwnVault(true);
        } else {
            setIsOwnVault(false);
        }
    }, [account, vault]);

    function getMatchingNft() {
        const NFT = NFTs.find((NFT) => {
            return parseInt(NFT.id._hex) === vault.raw.nftID;
        });
        return NFT;
    }

    async function handleApproval() {
        const isApproved = await getApproved(vault.raw.nftID);
        return isApproved;
    }

    async function handleMetadata() {
        const NFT = getMatchingNft(vault, NFTs);
        const NFTMetadata = await getNFTMetadata(NFT.uri);
        vault.raw.nftImageURL = NFTMetadata;
    }

    useEffect(() => {
        switch (status) {
            case vaultStatuses.READY:
                setAction('lockVault');
                break;
            case vaultStatuses.NFTISSUED:
                setLoading(true);
                handleMetadata().then(() => setLoading(false));
                handleApproval().then((isApproved) => {
                    setAction(
                        isApproved
                            ? isOwnVault
                                ? 'closeVault'
                                : 'liquidateVault'
                            : 'approveVault'
                    );
                });
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
    }, [vault, status]);

    return (
        <>
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
                            status={vault.raw.status}
                            isCreator={vault.raw.owner === account.address}
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
                                                vault.raw.uuid
                                            )}
                                        </Text>
                                    </Td>
                                </Tr>
                                <Tr>
                                    <Td>
                                        <Text variant="property">Creator</Text>
                                    </Td>
                                    <Td>
                                        <Text>
                                            {easyTruncateAddress(
                                                vault.raw.owner
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
                                            {vault.formatted.vaultCollateral}
                                        </Text>
                                    </Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </TableContainer>
                    <Box padding="5px">
                        {vault.raw.status === 'NftIssued' ? (
                            <>
                                {!isLoading ? (
                                    <Image
                                        src={vault.raw.nftImageURL}
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
        </>
    );
}
