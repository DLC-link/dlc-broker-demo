import React from 'react';
import eventBus from '../EventBus';
import { Button, Text, HStack, Flex, Image, Spacer } from '@chakra-ui/react';
import Account from './Account';
import Balance from './Balance';

export default function Header({ address, isConnected, walletType, isLoading, depositAmount, walletBalance}) {
  return (
    <>
      <HStack
        height='auto'
        width='auto'
        spacing={[5, 55]}
        marginTop={[5, 25]}
        marginBottom={[5, 25]}
        marginLeft={5}
        marginRight={25}>
        <Button
          as='a'
          href='https://www.dlc.link/'
          _hover={{
            background: 'none',
          }}
          shadow='none'
          variant='ghost'
          height={[25, 65]}
          width={100}>
          <Image
            src='/dlc.link_logo.svg'
            alt='DLC.Link Logo'
            height={[25, 65]}
            width={[25, 65]}
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
