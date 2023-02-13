import React from 'react';
import { Flex, VStack, Button } from '@chakra-ui/react';
import { approveNFTBurn, closeVault } from '../blockchainFunctions/ethereumFunctions';
import { lockBTC } from '../blockchainFunctions/bitcoinFunctions';

export function ActionButtons({ action, vault }) {
  switch (action) {
    case 'lockBTC':
      return (
        <Flex>
          {vault.raw.status === 2 && (
            <VStack>
              <Button
                variant='outline'
                onClick={() => lockBTC(vault)}>
                LOCK BTC
              </Button>
            </VStack>
          )}
        </Flex>
      );
    case 'closeVault':
      return (
        <Flex>
          <VStack>
            <Button
              variant='outline'
              onClick={() => closeVault(vault.raw.uuid)}>
              CLOSE VAULT
            </Button>
          </VStack>
        </Flex>
      );
    case 'approveVault':
      return (
        <Flex>
          <VStack>
            <Button
              variant='outline'
              onClick={() => approveNFTBurn(vault.raw.nftID)}>
              APPROVE
            </Button>
          </VStack>
        </Flex>
      );
    case 'liquidateVault':
      return (
        <Flex>
          <VStack>
            <Button variant='outline'>LIQUIDATE VAULT</Button>
          </VStack>
        </Flex>
      );
    case 'pendingVault':
      return (
        <Flex>
          <Button
            _hover={{
              shadow: 'none',
            }}
            isLoading
            loadingText='PENDING'
            color='gray'
            variant='outline'></Button>
        </Flex>
      );
  }
}
