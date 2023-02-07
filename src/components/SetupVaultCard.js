/*global chrome*/

import { useEffect } from 'react';
import { Flex, Text, VStack, Button, TableContainer, Tbody, Table, Tr, Td, Image, Box } from '@chakra-ui/react';
import { easyTruncateAddress } from '../utils';
import { customShiftValue, fixedTwoDecimalShift } from '../utils';
import Status from './Status';
import eventBus from '../EventBus';
import { useState } from 'react';
import RepayModal from '../modals/RepayModal';
import { liquidateEthereumLoanContract } from '../blockchainFunctions/ethereumFunctions';

export default function Card({ loan, address, walletType, blockchain, bitCoinValue }) {
  const openDepositModal = () => {
    eventBus.dispatch('is-deposit-modal-open', { isDepositOpen: true });
  };

  return (
    <>
      <Flex
        bgGradient='linear(to-d, secondary1, secondary2)'
        borderRadius='lg'
        justifyContent='center'
        shadow='dark-lg'
        width={250}
        marginLeft={15}
        marginRight={15}
        marginTop={25}
        marginBottom={25}
        _hover={{
          bg: 'accent',
          cursor: 'pointer',
          transition: '0.5s',
          transform: 'translateY(-35px)',
        }}
        onClick={openDepositModal}>
        <VStack
          margin={15}
          justifyContent='center'>
          <Text fontSize='9xl'>+</Text>
        </VStack>
      </Flex>
    </>
  );
}
