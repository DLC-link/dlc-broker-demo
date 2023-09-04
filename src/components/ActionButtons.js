import React from 'react';
import { Text, VStack, Button, Tooltip } from '@chakra-ui/react';
import {
    approveNFTBurn,
    closeVault,
} from '../blockchainFunctions/ethereumFunctions';
import { fetchBitcoinContractOfferAndSendToUserWallet } from '../blockchainFunctions/bitcoinFunctions';
import { vaultStatuses } from '../enums/VaultStatuses';
import { useDispatch } from 'react-redux';

export function ActionButtons({ vault }) {
    const dispatch = useDispatch();
    let actionButton;

    const ButtonContainer = ({ children }) => {
        return (
            <VStack spacing={2.5} padding={15}>
                {children}
            </VStack>
        );
    };

    switch (vault.status) {
        case vaultStatuses.READY:
            actionButton = (
                <ButtonContainer>
                    <Button
                        variant="outline"
                        onClick={() => {
                            fetchBitcoinContractOfferAndSendToUserWallet(vault);
                        }}
                    >
                        LOCK BTC
                    </Button>
                </ButtonContainer>
            );
            break;
        case vaultStatuses.NFTISSUED:
            if (!vault.isApproved) {
                actionButton = (
                    <ButtonContainer>
                        <Button
                            variant="outline"
                            onClick={() => approveNFTBurn(vault.nftID)}
                        >
                            APPROVE FOR CLOSING
                        </Button>
                    </ButtonContainer>
                );
                break;
            } else if (vault.isUserCreated) {
                actionButton = (
                    <ButtonContainer>
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
                    </ButtonContainer>
                );
                break;
            } else {
                actionButton = (
                    <ButtonContainer>
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
                    </ButtonContainer>
                );
            }
            break;
        case vaultStatuses.FUNDED:
        case vaultStatuses.PREREPAID:
        case vaultStatuses.PRELIQUIDATED:
        case vaultStatuses.PREFUNDED:
            actionButton = (
                <ButtonContainer>
                    <Button
                        variant="outline"
                        isLoading
                        loadingText="PENDING"
                        color="gray"
                        _hover={{
                            shadow: 'none',
                        }}
                    />
                </ButtonContainer>
            );
            break;
        case vaultStatuses.REPAID:
        case vaultStatuses.LIQUIDATED:
            break;
        default:
            break;
    }

    return actionButton;
}
