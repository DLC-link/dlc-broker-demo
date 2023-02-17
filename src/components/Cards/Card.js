/*global chrome*/

import { Flex, Text, VStack, TableContainer, Tbody, Table, Tr, Td, Image, Box, Spacer } from '@chakra-ui/react';
import { easyTruncateAddress } from '../../utilities/formatFunctions';
import Status from '../Status';
import { ActionButtons } from '../ActionButtons';
import { useState, useEffect } from 'react';
import { getApproved } from '../../blockchainFunctions/ethereumFunctions';

export default function Card({ vault, status }) {
  const [action, setAction] = useState(undefined);

  async function handleApproval() {
    const isApproved = await getApproved(vault.raw.nftID);
    return isApproved;
  }

  useEffect(() => {
    switch (status) {
      case 2:
        setAction('lockVault');
        break;
      case 4:
        handleApproval().then((isApproved) => {
          setAction(isApproved ? 'closeVault' : 'approveVault');
        });
        break;
      case 1:
      case 3:
      case 5:
      case 7:
        setAction('pendingVault');
        break;
      case 6:
        setAction('closedVault');
    }
  }, [vault, status]);

  return (
    <>
      <Flex
        marginTop='25px'
        marginBottom='25px'
        marginLeft='15px'
        marginRight='15px'
        height='450px'
        width='250px'
        borderRadius='lg'
        shadow='dark-lg'
        bgGradient='linear(to-d, secondary1, secondary2)'
        justifyContent='center'>
        <VStack margin='15px'>
          <Flex>
            <Status status={vault.raw.status}></Status>
          </Flex>
          <TableContainer>
            <Table
              variant='unstyled'
              size='sm'>
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
          <Box padding='5px'>
            {vault.raw.status === 4 ? (
              <Image
                src={vault.raw.nftImageURL}
                alt='NFT'
                margin='0px'
                shadow='dark-lg'
                boxSize='200px'></Image>
            ) : (
              <Spacer
                margin='0px'
                height='200px'></Spacer>
            )}
          </Box>
          {action !== undefined && (
            <ActionButtons
              action={action}
              vault={vault}></ActionButtons>
          )}
        </VStack>
      </Flex>
    </>
  );
}
