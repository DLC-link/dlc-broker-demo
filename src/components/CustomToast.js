import { Link, Flex, HStack, Text } from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';

export default function CustomToast({ isMobile, data }) {
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

  const explorerAddressMap = {
    stacks: `https://explorer.stacks.co/txid/${data.txId}`,
    ethereum: `https://sepolia.etherscan.io/tx/${data.txId}`,
  };

  const success = !(data.status === ('Cancelled' || 'Failed'));
  const message = eventMap[data.status];
  const explorerAddress = data.status === 'NftIssued' ? data.nftPage : explorerAddressMap[data.chain];

  return (
    <Flex>
      <Link
        py={isMobile ? '0px' : '100px'}
        px={isMobile ? '0px' : '20px'}
        href={explorerAddress}
        isExternal
        _hover={{
          textDecoration: 'none',
        }}>
        <Flex
          height='45px'
          width='350px'
          borderRadius='lg'
          bgColor='rgba(4, 186, 178, 0.8)'
          color='white'
          justifyContent='center'
          alignItems='center'
          _hover={{
            opacity: '100%',
            bg: 'secondary1',
          }}>
          <HStack spacing={3.5}>
            {success === true ? (
              <CheckCircleIcon color='green'></CheckCircleIcon>
            ) : (
              <WarningIcon color='red'></WarningIcon>
            )}
            <Text
              fontSize='12px'
              fontWeight='extrabold'>
              {message}
            </Text>
            {success && data.status !== 'Initialized' && data.status !== 'NftIssued' && (
              <Text
                fontSize='8px'
                fontWeight='bold'>
                Click to show transaction in the explorer!
              </Text>
            )}
            {data.status === 'NftIssued' && (
              <Text
                fontSize='8px'
                fontWeight='bold'>
                Click to show NFT on OpenSea!
              </Text>
            )}
          </HStack>
        </Flex>
      </Link>
    </Flex>
  );
}
