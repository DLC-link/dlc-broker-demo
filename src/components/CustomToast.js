import { Link, Flex, HStack, Text, Box } from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';

export default function CustomToast({ data }) {
  const eventMap = {
    refresh: '',
    initialized: 'Vault initialized!',
    setup: 'Vault established!',
    created: 'Vault is ready!',
    funded: 'Vault is funded!',
    minted: 'Minted NFT!',
    burned: 'Burned NFT!',
    'closing-requested': 'Requested closing!',
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
      <>
        <Link
          href={explorerAddress}
          isExternal
          _hover={{
            textDecoration: 'none',
          }}>
          <Box
            marginTop={150}
            paddingRight={15}>
            <Flex
              color='white'
              bgColor='rgba(4, 186, 178, 0.8)'
              borderRadius='sm'
              boxShadow='dark-lg'
              height={45}
              width={350}
              justifyContent='center'
              alignItems='center'
              _hover={{
                opacity: '100%',
                bg: 'accent',
              }}>
              <HStack spacing={3.5}>
                {success === true ? (
                  <CheckCircleIcon color='green'></CheckCircleIcon>
                ) : (
                  <WarningIcon color='red'></WarningIcon>
                )}
                <Text
                  fontSize={12}
                  fontWeight='extrabold'>
                  {message}
                </Text>
                {success && data.status !== 'initialized' && data.status !== 'minted' && (
                  <Text
                    fontSize={8}
                    fontWeight='bold'>
                    Click to show transaction in the explorer!
                  </Text>
                )}
                {data.status === 'minted' && 
                <Text
                    fontSize={8}
                    fontWeight='bold'>
                    Click to show NFT on OpenSea!
                  </Text>}
              </HStack>
            </Flex>
          </Box>
        </Link>
      </>
    );
  }
}
