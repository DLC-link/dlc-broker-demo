/*global chrome*/

import { useEffect } from 'react';
import { Flex, Text, VStack, Button, TableContainer, Tbody, Table, Tr, Td, Image, Box } from '@chakra-ui/react';
import { easyTruncateAddress } from '../utils';
import { customShiftValue, fixedTwoDecimalShift } from '../utils';
import Status from './Status';
import eventBus from '../EventBus';
import { useState } from 'react';
import RepayModal from '../modals/RepayModal';
import { liquidateEthereumLoanContract } from '../blockchainFunctions/ethereumFunctions';

export default function Card({ loan, address, walletType, blockchain, bitCoinValue }) {
  const [isRepayModalOpen, setRepayModalOpen] = useState(false);

  useEffect(() => {
    eventBus.on('loan-event', (event) => {
      if (event.status === 'repay-requested') {
        onRepayModalClose();
      }
    });
  }, []);

  const onRepayModalClose = () => {
    setRepayModalOpen(false);
  };

  const sendOfferForSigning = async (offer) => {
    console.log('Offer: ', offer);
    const extensionIDs = [
      'nminefocgojkadkocbddiddjmoooonhe',
      'gjjgfnpmfpealbpggmhfafcddjiopbpa',
      'kmidoigmjbbecngmenanflcogbjojlhf',
      'niinmdkjgghdkkmlilpngkccihjmefin',
      'bdadpbnmclplacnjpjoigpmbcinccnep',
      'pijajlnoadmfancnckejodabelilkcoa', // Niel's
    ];

    for (let i = 0; i < extensionIDs.length; i++) {
      chrome.runtime.sendMessage(
        extensionIDs[i],
        {
          action: 'get-offer',
          data: { offer: offer },
        },
        {},
        function () {
          if (chrome.runtime.lastError) {
            console.log('Failure: ' + chrome.runtime.lastError.message);
          } else {
            console.log('Success: Found receiving end.');
          }
        }
      );
    }
  };

  const lockBTC = async () => {
    const URL = process.env.REACT_APP_WALLET_DOMAIN + `/offer`;
    try {
      const response = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uuid: loan.formatted.formattedUUID,
          acceptCollateral: parseInt(loan.raw.vaultCollateral),
          offerCollateral: 1000,
          totalOutcomes: 100,
        }),
      });
      const responseStream = await response.json();
      if (!response.ok) {
        console.error(responseStream.errors[0].message);
      }
      sendOfferForSigning(responseStream);
    } catch (error) {
      console.error(error);
    }
  };

  const countCollateralToDebtRatio = (bitCoinValue, vaultCollateral, loan) => {
    const formattedVaultCollateral = customShiftValue(vaultCollateral, 8, true);
    const formattedVaultLoan = customShiftValue(loan, 6, true);
    const collateralToDebtRatio = ((bitCoinValue * formattedVaultCollateral) / formattedVaultLoan) * 100;
    const roundedCollateralToDebtRatio = Math.round((collateralToDebtRatio + Number.EPSILON) * 100) / 100;
    return roundedCollateralToDebtRatio;
  };

  return (
    <>
      <Flex
        bgGradient='linear(to-d, secondary1, secondary2)'
        borderRadius='lg'
        justifyContent='center'
        shadow='dark-lg'
        width={250}
        marginLeft={15}
        marginRight={15}
        marginTop={25}
        marginBottom={25}>
        <VStack margin={15}>
          <Flex>
            <Status status={loan.status}></Status>
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
                    <Text>{easyTruncateAddress(loan.uuid)}</Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Text variant='property'>Depositor</Text>
                  </Td>
                  <Td>
                    <Text>{easyTruncateAddress(loan.depositor)}</Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Text variant='property'>Vault Collateral</Text>
                  </Td>
                  <Td>
                    <Text>{customShiftValue(loan.vaultCollateral, 8, true) + ' BTC'}</Text>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
          <Box padding={15}>
            {loan.nftAddress !== undefined ? (
              <Image
                src={loan.nftAddress}
                alt='NFT'
                shadow='dark-lg'
                boxSize={[150, 200]}></Image>
            ) : (
              <Box
                padding={15}
                height={[150, 200]}></Box>
            )}
          </Box>
          <Flex>
            {loan.status === 'ready' && (
              <VStack>
                <Button
                  variant='outline'
                  onClick={lockBTC}>
                  LOCK BTC
                </Button>
              </VStack>
            )}
            {loan.status === ('not-ready' || 'pre-liquidated' || 'pre-paid') && (
              <Button
                _hover={{
                  shadow: 'none',
                }}
                isLoading
                loadingText='PENDING'
                color='gray'
                variant='outline'></Button>
            )}
            {loan.status === 'funded' && loan.depositor.toLowerCase() === address && (
              <VStack>
                <Button
                  variant='outline'
                  onClick={() => setRepayModalOpen(true)}>
                  CLOSE VAULT
                </Button>
              </VStack>
            )}
            {loan.status === 'funded' && loan.depositor.toLowerCase() !== address && (
              <VStack>
                <Button
                  variant='outline'
                  onClick={() => liquidateEthereumLoanContract(loan.uuid)}>
                  LIQUIDATE VAULT
                </Button>
              </VStack>
            )}
          </Flex>
        </VStack>
      </Flex>
    </>
  );
}
