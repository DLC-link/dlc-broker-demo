import React from 'react';
import eventBus from '../utilities/eventBus';
import { Button, Text, HStack, Flex, Image, Spacer } from '@chakra-ui/react';
import Account from './Account';
import Balance from './Balance';

export default function Header({ isLoading, isConnected, walletType, address, depositAmount, walletBalance }) {
  return (
    <>
      <HStack margin={['15px', '30px']}>
        <Button
          variant='ghost'
          as='a'
          margin='0px'
          boxSize={['65px', '97.5px']}
          borderRadius='lg'
          href='https://www.dlc.link/'
          _hover={{
            background: 'secondary1',
          }}>
          <Image
            src='/dlc.link_logo.svg'
            alt='DLC.Link Logo'
          />
        </Button>
        <Spacer></Spacer>
        <Account
          address={address}
          isConnected={isConnected}
          walletType={walletType}
          isLoading={isLoading}
          depositAmount={depositAmount}
          walletBalance={walletBalance}></Account>
      </HStack>
    </>
  );
}
