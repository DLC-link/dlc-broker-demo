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
              {vaults?.map((vault) => (
                <Card
                  key={vault.raw.uuid}
                  vault={vault}
                  address={address}
                  walletType={walletType}
                  blockchain={blockchain}
                  bitCoinValue={bitCoinValue}></Card>
              ))}
              {initialVaults?.map((vault) => (
                <InitialCard
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
