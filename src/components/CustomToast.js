import { Link, Flex, HStack, Text, Box } from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';

export default function CustomToast({ isMobile, data }) {
  console.log(isMobile)
  const eventMap = {
    refresh: '',
    initialized: 'Vault initialized!',
    setup: 'Vault established!',
    ready: 'Vault is ready!',
    funded: 'Vault is funded!',
    minted: 'Minted NFT!',
    burned: 'Burned NFT!',
    'close-requested': 'Requested closing!',
    closing: 'Processing closing!',
    closed: 'Vault closed!',
    'approve-requested': 'Approve requested!',
    approved: 'Approved!',
    cancelled: 'Transaction cancelled!',
    failed: 'Transaction failed!',
    'liquidation-requested': 'Requested liquidation!',
    'attempting-liquidation': 'Attempting liquidation!',
    liquidating: 'Processing liquidation!',
    liquidated: 'Loan liquidated!',
  };

  const explorerAddressMap = {
    stacks: `https://explorer.stacks.co/txid/${data.txId}`,
    ethereum: `https://goerli.etherscan.io/tx/${data.txId}`,
  };

  const success = !(data.status === ('cancelled' || 'failed'));
  const message = eventMap[data.status];
  const explorerAddress = data.status === 'minted' ? data.nftPage : explorerAddressMap[data.chain];

  if (data.status !== 'refresh') {
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
              {success && data.status !== 'initialized' && data.status !== 'minted' && (
                <Text
                  fontSize='8px'
                  fontWeight='bold'>
                  Click to show transaction in the explorer!
                </Text>
              )}
              {data.status === 'minted' && (
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
}
