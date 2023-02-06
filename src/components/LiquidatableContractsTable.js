/*global chrome*/

import React from 'react';
import { VStack, HStack, Collapse, SimpleGrid, ScaleFade } from '@chakra-ui/react';
import Card from './Card';
import InitialCard from './InitialCard';

export default function MyContractsTable({
  isConnected,
  creator,
  walletType,
  blockchain,
  isLoading,
  bitCoinValue,
  loans,
}) {
  return (
    <>
      <Collapse in={isConnected}>
        <VStack
          margin={25}
          alignContent='center'
          justifyContent='center'>
          <HStack spacing={15}></HStack>
          <ScaleFade in={!isLoading}>
            <SimpleGrid
              columns={[1, 4]}
              spacing={[0, 15]}>
              {loans?.map((loan) => (
                <Card
                  key={loan.uuid}
                  loan={loan}
                  creator={creator}
                  walletType={walletType}
                  blockchain={blockchain}
                  bitCoinValue={bitCoinValue}></Card>
              ))}
            </SimpleGrid>
          </ScaleFade>
        </VStack>
      </Collapse>
    </>
  );
}
