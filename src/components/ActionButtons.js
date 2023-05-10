import React from 'react';
import { Flex, VStack, Button, Tooltip } from '@chakra-ui/react';
import {
    approveNFTBurn,
    closeVault,
} from '../blockchainFunctions/ethereumFunctions';
import { lockBTC } from '../blockchainFunctions/bitcoinFunctions';
import { useSelector } from 'react-redux';
import { vaultStatuses } from '../enums/VaultStatuses';
import { selectVaultByUUID } from '../store/vaultsSlice';

export function ActionButtons({ vaultUUID }) {
    const vault = useSelector((state) => selectVaultByUUID(state, vaultUUID));

    function renderButton(vault) {
        switch (vault.status) {
            case vaultStatuses.READY:
                return (
                    <Flex>
                        <VStack>
                            <Button
                                variant="outline"
                                onClick={() => lockBTC(vault)}
                            >
                                LOCK BTC
                            </Button>
                        </VStack>
                    </Flex>
                );
            case vaultStatuses.NFTISSUED:
                if (!vault.isApproved) {
                    return (
                        <Flex>
                            <VStack>
                                <Button
                                    variant="outline"
                                    onClick={() => approveNFTBurn(vault.nftID)}
                                >
                                    APPROVE FOR CLOSING
                                </Button>
                            </VStack>
                        </Flex>
                    );
                }
                if (vault.isUserCreated) {
                    return (
                        <Flex>
                            <VStack>
                                <Tooltip
                                    label="Close the vault and redeem the collateral value on the Bitcoin chain. This will unlock the DLC with a full repayment to you. The NFT will be burned."
                                    fontSize={'sm'}
                                    padding={2}
                                    textAlign={'justify'}
                                    borderRadius={'lg'}
                                >
                                    <Button
                                        variant="outline"
                                        onClick={() => closeVault(vault.uuid)}
                                    >
                                        CLOSE VAULT
                                    </Button>
                                </Tooltip>
                            </VStack>
                        </Flex>
                    );
                }
                return (
                    <Flex>
                        <VStack>
                            <Tooltip
                                label="Liquidate the vault and redeem the collateral value for WBTC. The NFT will be burned."
                                fontSize={'sm'}
                                padding={2}
                                textAlign={'justify'}
                                borderRadius={'lg'}
                            >
                                <Button
                                    variant="outline"
                                    onClick={() => closeVault(vault.uuid)}
                                >
                                    REDEEM
                                </Button>
                            </Tooltip>
                        </VStack>
                    </Flex>
                );
            case vaultStatuses.NOTREADY:
            case vaultStatuses.FUNDED:
            case vaultStatuses.PREREPAID:
            case vaultStatuses.PRELIQUIDATED:
                return (
                    <Flex>
                        <Button
                            variant="outline"
                            isLoading
                            loadingText="PENDING"
                            color="gray"
                            _hover={{
                                shadow: 'none',
                            }}
                        ></Button>
                    </Flex>
                );

            case vaultStatuses.REPAID:
            case vaultStatuses.LIQUIDATED:
                break;
            default:
                break;
        }
    }
    return <>{renderButton(vault)}</>;
}
