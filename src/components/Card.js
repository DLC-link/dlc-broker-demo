/*global chrome*/

import { Flex, Text, VStack, Button, TableContainer, Tbody, Table, Tr, Td, Image, Box, Spacer } from '@chakra-ui/react';
import { easyTruncateAddress } from '../utilities/format';
import Status from './Status';
import { approveNFTBurn, closeVault } from '../blockchainFunctions/ethereumFunctions';
import { lockBTC } from '../blockchainFunctions/bitcoinFunctions';

export default function Card({ vault, address }) {
  const showCloseVault = vault.raw.status === 4 && vault.raw.owner.toLowerCase() === address && vault.raw.approved === true;
  const showApproveVault = vault.raw.status === 4 && vault.raw.owner.toLowerCase() === address && vault.raw.approved === false;
  const showLiquidateVault = vault.raw.status === 4 && vault.raw.owner.toLowerCase() !== address;
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
        marginBottom={25}>
        <VStack margin={15}>
          <Flex>
            <Status status={vault.raw.status}></Status>
          </Flex>
          <TableContainer>
            <Table
              size='sm'
              variant='unstyled'>
              <Tbody>
                <Tr>
                  <Td>
                    <Text variant='property'>UUID</Text>
                  </Td>
                  <Td>
                    <Text>{easyTruncateAddress(vault.raw.uuid)}</Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Text variant='property'>Owner</Text>
                  </Td>
                  <Td>
                    <Text>{easyTruncateAddress(vault.raw.owner)}</Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Text variant='property'>Vault Collateral</Text>
                  </Td>
                  <Td>
                    <Text>{vault.formatted.vaultCollateral}</Text>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
          <Box padding={5}>
            {vault.raw.status === 4 && (
              <Image
                src={vault.raw.nftImageURL}
                alt='NFT'
                shadow='dark-lg'
                boxSize='100px'
                margin='15px'></Image>
            )}
          </Box>
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
            {[1, 5, 7].includes(vault.raw.status) && (
              <Button
                _hover={{
                  shadow: 'none',
                }}
                isLoading
                loadingText='PENDING'
                color='gray'
                variant='outline'></Button>
            )}
            {showCloseVault && (
              <VStack>
                <Button
                  variant='outline'
                  onClick={() => closeVault(vault.raw.uuid)}>
                  CLOSE VAULT
                </Button>
              </VStack>
            )}
            {showApproveVault && (
              <VStack>
                <Button
                  variant='outline'
                  onClick={() => approveNFTBurn(vault.raw.nftID)}>
                  APPROVE
                </Button>
              </VStack>
            )}
            {showLiquidateVault && (
              <VStack>
                <Button variant='outline'>LIQUIDATE VAULT</Button>
              </VStack>
            )}
          </Flex>
        </VStack>
      </Flex>
    </>
  );
}
