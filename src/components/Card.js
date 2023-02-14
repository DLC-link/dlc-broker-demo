/*global chrome*/

import { Flex, Text, VStack, TableContainer, Tbody, Table, Tr, Td, Image, Box, Spacer } from '@chakra-ui/react';
import { easyTruncateAddress } from '../utilities/format';
import Status from './Status';
import { ActionButtons } from './ActionButtons';
import { useState, useEffect } from 'react';
import { getApproved } from '../blockchainFunctions/ethereumFunctions';

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
          <Box padding='5px'>
            {vault.raw.status === 4 ? (
              <Image
                src={vault.raw.nftImageURL}
                alt='NFT'
                shadow='dark-lg'
                boxSize='200px'
                margin='0px'></Image>
            ) : (
              <Spacer
                height='200px'
                margin='15px'></Spacer>
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
