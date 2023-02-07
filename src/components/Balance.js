import React from 'react';
import { Text, HStack, Flex } from '@chakra-ui/react';

export default function Balance({ isConnected, depositAmount, nftQuantity }) {
  return (
    <>
      {isConnected && (
        <>
          <Flex
            height='15px'
            width='350px'
            borderRadius='lg'
            border='1px'
            borderColor='white'
            shadow='dark-lg'
            paddingTop='15px'
            paddingBottom='15px'
            align='center'
            justifyContent='center'>
            <HStack>
              <Text
                fontSize='small'
                fontWeight='extrabold'
                color='accent'>
                Deposit Balance:{' '}
              </Text>
              <Text paddingRight='25px'>{depositAmount} BTC</Text>
              <Text
                fontSize='small'
                fontWeight='extrabold'
                color='accent'
                paddingLeft='25px'>
                Owned NFTs:{' '}
              </Text>
              <Text>{nftQuantity}</Text>
            </HStack>
          </Flex>
        </>
      )}
    </>
  );
}
