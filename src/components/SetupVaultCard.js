/*global chrome*/

import { Flex, Text, VStack } from '@chakra-ui/react';
import eventBus from '../EventBus';

export default function SetupVaultCard() {
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
        height={450}
        width={250}
        marginLeft={15}
        marginRight={15}
        marginTop={25}
        marginBottom={25}
        transition= 'all .25s ease'
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
