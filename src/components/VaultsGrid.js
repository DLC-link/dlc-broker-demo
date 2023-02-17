/*global chrome*/

import React from 'react';
import { VStack, HStack, Collapse, SimpleGrid, ScaleFade } from '@chakra-ui/react';
import Card from './Cards/Card';
import InitialCard from './Cards/InitialCard';
import SetupVaultCard from './Cards/SetupVaultCard';

export default function VaultsGrid({
  isLoading,
  isConnected,
  walletType,
  address,
  blockchain,
  initialVaults,
  vaults,
  bitCoinValue,
}) {
  return (
    <>
      <Collapse in={isConnected}>
        <VStack
          justifyContent='center'
          alignContent='center'>
          <HStack></HStack>
          <ScaleFade in={!isLoading}>
            <SimpleGrid
              columns={[1, 4]}
              spacing={[0, 15]}>
              <SetupVaultCard></SetupVaultCard>
              {initialVaults?.map((vault, j) => (
                <InitialCard
                  key={j}
                  vault={vault}
                  creator={address}></InitialCard>
              ))}
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
            </SimpleGrid>
          </ScaleFade>
        </VStack>
      </Collapse>
    </>
  );
}
