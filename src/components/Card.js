/*global chrome*/

import { Flex, Text, VStack, TableContainer, Tbody, Table, Tr, Td, Image, Box, Spacer } from '@chakra-ui/react';
import { easyTruncateAddress } from '../utilities/format';
import Status from './Status';
import { ActionButtons } from './ActionButtons';
import { useState, useEffect } from 'react';
import { getApproved } from '../blockchainFunctions/ethereumFunctions'

export default function Card({ vault, address, status }) {
  const [action, setAction] = useState();
  const [isApproved, setApproved] = useState(undefined);

  useEffect(() => {
    async function handleApproval(){
      const isApproved = await getApproved(vault.raw.nftID)
      setApproved(isApproved)
    }
    handleApproval();
    if (status === 2) {
      setAction('lockBTC');
    } else if (status === 4) {
      setAction('closeOrApproveVault');
    } else if ([1, 5, 7].includes(status)) {
      setAction('pendingVault');
    }
  }, []);

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
            {vault.raw.status === 4 ? (
              <Image
                src={vault.raw.nftImageURL}
                alt='NFT'
                shadow='dark-lg'
                boxSize='100px'
                margin='15px'></Image>
            ) : (
              <Spacer
                height='100px'
                margin='15px'></Spacer>
            )}
          </Box>
          {isApproved !== undefined && (
            <ActionButtons
              action={action}
              isApproved={isApproved}
              vault={vault}></ActionButtons>
          )}
        </VStack>
      </Flex>
    </>
  );
}
