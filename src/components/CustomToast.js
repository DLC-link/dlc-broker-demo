import { Link, Flex, HStack, Text, VStack, Spacer } from '@chakra-ui/react';

import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import { useSelector } from 'react-redux';

const VaultBlockchainEvent = {
    READY: 'Vault is ready!',
    FUNDED: 'Vault is funded!',
    NFTISSUED: 'NFT issued!',
    APPROVED: 'USDC spending approved!',
    BORROWED: 'USDC borrowed!',
    PREREPAID: 'Processing loan closure!',
    REPAID: 'Vault repaid!',
    PRECLOSED: 'Processing vault closure!',
    CLOSED: 'Vault closed!',
    PRELIQUIDATED: 'Processing liquidation!',
    LIQUIDATED: 'Vault liquidated!',
    INVALIDLIQUIDATION: 'No liquidation required!',
};

const WalletInteractionEvent = {
    SETUPREQUESTED: 'Vault setup requested!',
    APPROVEREQUESTED: 'USDC spend allowance requested!',
    BORROWREQUESTED: 'Borrow requested!',
    REPAYREQUESTED: 'Repayment requested!',
    CLOSEREQUESTED: 'Vault closure requested!',
    LIQUIDATIONREQUESTED: 'Liquidation requested!',
    TRANSACTIONCANCELLED: 'Transaction cancelled!',
    TRANSACTIONFAILED: 'Transaction failed!',
    FETCHFAILED: 'Failed to fetch offer!',
    ACCEPTFAILED: 'Failed to lock Bitcoin!',
    ACCEPTSUCCEEDED: 'Locked Bitcoin!',
};

const BlockchainInteractionEvent = {
    CONNECTIONFAILED: "Couldn't connect to blockchain!",
    RETRIEVALFAILED: "Couldn't get vaults!",
};

export const ToastEvent = {
    ...VaultBlockchainEvent,
    ...WalletInteractionEvent,
    ...BlockchainInteractionEvent,
};

export default function CustomToast({ txHash, status, message }) {
    const { blockchain } = useSelector((state) => state.account);

    const ethereumExplorerURLs = {
        5: `https://goerli.etherscan.io/tx/${txHash}`,
        11155111: `https://sepolia.etherscan.io/tx/${txHash}`,
    };

    const bitcoinNetwork = blockchain === '1' ? 'mainnet' : 'testnet';

    const bitcoinExplorerURL = `https://mempool.space/${
        bitcoinNetwork !== 'mainnet' ? bitcoinNetwork + '/' : ''
    }tx/${txHash}`;

    const isSuccessfulEvent = ![
        ToastEvent.ACCEPTFAILED,
        ToastEvent.FETCHFAILED,
        ToastEvent.TRANSACTIONFAILED,
        ToastEvent.TRANSACTIONCANCELLED,
        ToastEvent.RETRIEVALFAILED,
    ].includes(status);

    const eventExplorerAddress =
        isSuccessfulEvent && status === ToastEvent.ACCEPTSUCCEEDED
            ? bitcoinExplorerURL
            : isSuccessfulEvent
            ? ethereumExplorerURLs[blockchain]
            : undefined;

    const CustomToastContainer = ({ children }) => {
        return (
            <Link
                href={eventExplorerAddress}
                isExternal
                _hover={{
                    textDecoration: 'none',
                }}
            >
                <Flex
                    height="75px"
                    width="450px"
                    borderRadius="lg"
                    border={'1px solid white'}
                    bgColor=" rgba(80,0,86,0.5)"
                    color="white"
                    justifyContent="center"
                    alignItems="center"
                    transition="background-color 0.2s ease-in-out"
                    _hover={
                        isSuccessfulEvent
                            ? {
                                  bgColor: ' rgba(80,0,86,1.0)',
                                  transition:
                                      'background-color 0.2s ease-in-out',
                              }
                            : {}
                    }
                >
                    {children}
                </Flex>
            </Link>
        );
    };

    const CustomToastInfoStack = ({ children }) => {
        return (
            <HStack justifyContent={'space-between'} width={450} padding={25}>
                {children}
                <Spacer width={25} />
                <VStack spacing="1.5">
                    <Text fontSize="sm" fontWeight="extrabold">
                        {status}
                    </Text>
                    {isSuccessfulEvent && (
                        <Text fontSize="2xs" fontWeight="bold">
                            Click to show transaction in the explorer!
                        </Text>
                    )}
                    {message && (
                        <Text fontSize="2xs" fontWeight="bold">
                            {message}
                        </Text>
                    )}
                </VStack>
                <Spacer width={25} />
            </HStack>
        );
    };

    const CustomToastIcon = () => {
        return isSuccessfulEvent ? (
            <CheckCircleIcon color="#04BAB2" />
        ) : (
            <WarningIcon color="#FF4500" />
        );
    };

    return (
        <CustomToastContainer>
            <CustomToastInfoStack>
                <CustomToastIcon />
            </CustomToastInfoStack>
        </CustomToastContainer>
    );
}
