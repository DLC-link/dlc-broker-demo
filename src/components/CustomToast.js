import { Link, Flex, HStack, Text } from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';

export default function CustomToast({ txHash, blockchain, status }) {
    const eventMap = {
        Initialized: 'Vault initialized!',
        NotReady: 'Vault established!',
        Ready: 'Vault is ready!',
        Funded: 'Vault is funded!',
        NftIssued: 'Minted NFT!',
        Burned: 'Burned NFT!',
        CloseRequested: 'Requested closing!',
        PreRepaid: 'Processing closing!',
        Repaid: 'Vault closed!',
        ApproveRequested: 'Approve requested!',
        Approved: 'Approved!',
        Cancelled: 'Transaction cancelled!',
        Failed: 'Transaction failed!',
        LiquidationRequested: 'Requested liquidation!',
        AttemptingLiquidation: 'Attempting liquidation!',
        PreLiquidated: 'Processing liquidation!',
        Liquidated: 'Vault liquidated!',
    };

    const ethereumExplorerURLs = {
        5: `https://goerli.etherscan.io/tx/${txHash}`,
        11155111: `https://sepolia.etherscan.io/tx/${txHash}`,
    };

    const nftExplorerURL = 'https://testnets.opensea.io/account';

    const success = !(status === ('Cancelled' || 'Failed'));
    const message = eventMap[status];
    const explorerAddress =
        status === 'NftIssued'
            ? nftExplorerURL
            : ethereumExplorerURLs[blockchain];

    return (
        <Flex>
            <Link
                href={status === 'Initialized' ? '' : explorerAddress}
                isExternal
                _hover={{
                    textDecoration: 'none',
                }}
            >
                <Flex
                    height="45px"
                    width="350px"
                    borderRadius="lg"
                    bgColor="rgba(4, 186, 178, 0.8)"
                    color="white"
                    justifyContent="center"
                    alignItems="center"
                    _hover={{
                        opacity: '100%',
                        bg: 'secondary1',
                    }}
                >
                    <HStack spacing={3.5}>
                        {success === true ? (
                            <CheckCircleIcon color="green"></CheckCircleIcon>
                        ) : (
                            <WarningIcon color="red"></WarningIcon>
                        )}
                        <Text fontSize="12px" fontWeight="extrabold">
                            {message}
                        </Text>
                        {success &&
                            status !== 'Initialized' &&
                            status !== 'NftIssued' && (
                                <Text fontSize="8px" fontWeight="bold">
                                    Click to show transaction in the explorer!
                                </Text>
                            )}
                        {status === 'NftIssued' && (
                            <Text fontSize="8px" fontWeight="bold">
                                Click to show NFT on OpenSea!
                            </Text>
                        )}
                    </HStack>
                </Flex>
            </Link>
        </Flex>
    );
}
