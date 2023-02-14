/*global chrome*/

import React from 'react';
import { VStack, HStack, Collapse, SimpleGrid, ScaleFade } from '@chakra-ui/react';
import Card from './Card';
import InitialCard from './InitialCard';
import SetupVaultCard from './SetupVaultCard';

export default function MyContractsTable({
  isConnected,
  address,
  walletType,
  blockchain,
  isLoading,
  bitCoinValue,
  vaults,
  initialVaults,
}) {
  return (
    <>
      <Collapse in={isConnected}>
        <VStack
          alignContent='center'
          justifyContent='center'>
          <HStack spacing={15}></HStack>
          <ScaleFade in={!isLoading}>
            <SimpleGrid
              columns={[1, 4]}
              spacing={[0, 15]}>
              <SetupVaultCard></SetupVaultCard>
              {vaults?.map((vault, i) => (
                <Card
                  key={i}
                  vault={vault}
                  address={address}
                  walletType={walletType}
                  blockchain={blockchain}
                  bitCoinValue={bitCoinValue}
                  status={vault.raw.status}></Card>
              ))}
              {initialVaults?.map((vault, j) => (
                <InitialCard
                  key={j}
                  vault={vault}
                  creator={address}
                  walletType={walletType}
                  bitCoinValue={bitCoinValue}></InitialCard>
              ))}
            </SimpleGrid>
          </ScaleFade>
        </VStack>
      </Collapse>
    </>
  );
}
