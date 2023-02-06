import React, { useEffect, useState } from 'react';
import eventBus from '../EventBus';
import {
  VStack,
  Button,
  Text,
  Flex,
  Image,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Collapse,
  IconButton,
} from '@chakra-ui/react';
import { customShiftValue, fixedTwoDecimalShift } from '../utils';

export default function DepositWithdraw(props) {
  const isConnected = props.isConnected;
  const isLoading = props.isLoading;
  const [depositAmount, setDepositAmount] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);


  const openDepositModal = () => {
    eventBus.dispatch('is-deposit-modal-open', { isDepositOpen: true });
  };

  return (
    <>
      <Collapse in={isConnected}>
        <Flex
          margin={25}
          alignContent='center'
          justifyContent='center'
          padding={25}>
          <VStack>
            <Text
              fontSize={[25, 50]}
              fontWeight='extrabold'
              color='white'>
              Balance
            </Text>
            <Flex
              bgGradient='linear(to-d, secondary1, secondary2)'
              borderRadius='lg'
              alignContent='center'
              justifyContent='center'
              width={[250, 'full']}
              padding='10px 10px'
              boxShadow='dark-lg'>
              <VStack>
                <Button
                  _hover={{
                    color: 'white',
                    bg: 'secondary1',
                  }}
                  color='accent'
                  width={100}
                  shadow='lg'
                  variant='outline'
                  fontSize='sm'
                  fontWeight='bold'
                  onClick={openDepositModal}>
                  SETUP VAULT
                </Button>
              </VStack>
            </Flex>
          </VStack>
        </Flex>
      </Collapse>
    </>
  );
}
