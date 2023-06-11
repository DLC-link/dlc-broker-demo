import React, { useState, useEffect } from 'react';
import { easyTruncateAddress } from '../utilities/formatFunctions';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'


import {
  Text,
  Flex,
  Collapse,
  Button,
  TableContainer,
  Table,
  Thead,
  Td,
  Tr,
  Tbody
} from '@chakra-ui/react';

export default function Leaderboard() {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardContent, setLeaderboardContent] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const dlcBrokerAPI = 'https://api.studio.thegraph.com/query/48231/dlc-broker/version/latest';

  const queryClient = new ApolloClient({
    uri: dlcBrokerAPI,
    cache: new InMemoryCache(),
  });

  const mintingQuery = `
      query getMintingEvents {
        mintBtcNfts(orderBy: btcDeposit, orderDirection: desc, first: 10) {
          id
          btcDeposit
          dlcUUID
        }
      }
    `;

  function getLeaderboard() {
    queryClient.query({
      query: gql(mintingQuery),
    }).then(({ data: { mintBtcNfts } }) => {
      const setupQueryPromises = mintBtcNfts.map(({ dlcUUID }) => {
        const setupQuery = `
            query getSetupEvents {
              setupVaults(
                where: {dlcUUID_in: ["${dlcUUID}"]}
              ) {
                id
                dlcUUID
                btcDeposit
                owner
              }
            }
          `;
        return queryClient.query({
          query: gql(setupQuery),
        });
      });
      Promise.all(setupQueryPromises).then((setupQueryResults) => {
        const leaderboardContent = setupQueryResults.map(({ data: { setupVaults } }) => setupVaults[0]);
        leaderboardContent.sort((a, b) => b.btcDeposit - a.btcDeposit);
        setLeaderboardContent(leaderboardContent);
      }).catch((error) => {
        console.error('Error fetching data: ', error);
      });
    }).catch((error) => {
      console.error('Error fetching data: ', error);
    });
  }

  useEffect(() => {
    getLeaderboard();
  }, []);

  useEffect(() => {
    if (leaderboardContent.length > 0) {
      setLoading(false);
    }
  }, [leaderboardContent]);

  return (
    <>
      <Button
        isDisabled={isLoading}
        marginTop={0}
        variant={'outline'}
        width={'350px'}
        onClick={() => setShowLeaderboard(!showLeaderboard)}
      >
        SHOW LEADERBOARD
      </Button>
      <Collapse in={showLeaderboard}>
        <Flex
          padding="15px"
          height="350px"
          width="350px"
          borderRadius="lg"
          border='1px'
          borderColor='accent'
          shadow="dark-lg"
          backgroundPosition="left"
          justifyContent="center"
          _hover={{
            backgroundPosition: 'left',
          }}
        >
          <TableContainer>
            <Table variant="unstyled" size="sm" width={350}>
              <Thead>
                <Tr>
                  <Td textAlign='center' padding={1.5}>
                    <Text variant="property" color='accent'></Text></Td>
                  <Td textAlign='center' padding={1.5}><Text variant="property" color='accent'>Address</Text></Td>
                  <Td textAlign='center' padding={1.5}><Text variant="property" color='accent'>Locked BTC</Text></Td>
                </Tr>
              </Thead>
              <Tbody>
                {leaderboardContent.map((row, index) => (
                  <Tr key={index} >
                    <Td textAlign='center' padding={1.5}><Text>{index + 1}</Text></Td>
                    <Td textAlign='center' padding={1.5}><Text>{easyTruncateAddress(row.owner)}</Text></Td>
                    <Td textAlign='center' padding={1.5}><Text>{row.btcDeposit}</Text></Td>
                  </Tr>))}
              </Tbody>
            </Table>
          </TableContainer>
        </Flex>
      </Collapse>
    </>
  );
}
