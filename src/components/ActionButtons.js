import React from 'react';
import { Flex, VStack, Button, Tooltip } from '@chakra-ui/react';
import {
    approveNFTBurn,
    closeVault,
} from '../blockchainFunctions/ethereumFunctions';
import { lockBTC } from '../blockchainFunctions/bitcoinFunctions';

export function ActionButtons({ action, vault }) {
    switch (action) {
        case 'pendingVault':
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
        case 'lockVault':
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
        case 'approveVault':
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
        case 'closeVault':
            return (
                <Flex>
                    <VStack>
                        <Tooltip label="Close the vault and redeem the collateral value on the Bitcoin chain. This will unlock the DLC with a full repayment to you. The NFT will be burned.">
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
        case 'liquidateVault':
            return (
                <Flex>
                    <VStack>
                        <Tooltip label="Liquidate the vault and redeem the collateral value for WBTC. The NFT will be burned.">
                            <Button
                                variant="outline"
                                onClick={() => closeVault(vault.uuid)}
                            >
                                REDEEM WBTC
                            </Button>
                        </Tooltip>
                    </VStack>
                </Flex>
            );
        case 'closedVault':
            break;
        default:
            console.error('Unknown action type!');
            break;
    }
}
