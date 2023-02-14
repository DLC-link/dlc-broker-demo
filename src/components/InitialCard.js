import { Flex, Text, VStack, Button, TableContainer, Tbody, Table, Tr, Td, Box, Spacer } from '@chakra-ui/react';
import { easyTruncateAddress, customShiftValue } from '../utilities/format';
import Status from './Status';

export default function InitialCard({ vault, creator }) {
  const initialVault = {
    owner: creator,
    vaultCollateral: customShiftValue(vault.BTCDeposit, 8, true) + ' BTC',
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
        marginBottom={25}>
        <VStack margin={15}>
          <Flex>
            <Status status={1}></Status>
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
                    <Text></Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Text variant='property'>Owner</Text>
                  </Td>
                  <Td>
                    <Text>{easyTruncateAddress(initialVault.owner)}</Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Text variant='property'>Vault Collateral</Text>
                  </Td>
                  <Td>
                    <Text>{initialVault.vaultCollateral}</Text>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
          <Box padding={5}>
            <Spacer
              height='100px'
              margin='15px'></Spacer>
          </Box>
          <Button
            _hover={{
              shadow: 'none',
            }}
            isLoading
            loadingText='PENDING'
            color='gray'
            variant='outline'></Button>
        </VStack>
      </Flex>
    </>
  );
}
