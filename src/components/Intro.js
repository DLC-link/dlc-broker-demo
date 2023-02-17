import React from 'react';
import { Text, Collapse, Image, VStack } from '@chakra-ui/react';

export default function Header({ isConnected }) {
  return (
    <Collapse in={!isConnected}>
      <VStack
        marginTop='215px'
        justifyContent='center'
        alignItems='center'>
        <Image
          src='/BTC_Graphic_2.png'
          position='absolute'
          width='950px'
          blendMode='screen'></Image>
        <Text
          height={['25px', '50px']}
          fontSize={['25px', '50px']}
          fontWeight='semibold'
          color='accent'>
          Use Native Bitcoin
        </Text>
        <Text
          fontSize={['25px', '50px']}
          fontWeight='normal'
          color='white'>
          without wrapping
        </Text>
      </VStack>
    </Collapse>
  );
}
