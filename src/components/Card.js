/*global chrome*/

import { useEffect } from 'react';
import { Flex, Text, VStack, Button, TableContainer, Tbody, Table, Tr, Td } from '@chakra-ui/react';
import { easyTruncateAddress } from '../utils';
import { customShiftValue, fixedTwoDecimalShift } from '../utils';
import Status from './Status';
import eventBus from '../EventBus';
import { useState } from 'react';
import RepayModal from '../modals/RepayModal';
import { liquidateEthereumLoanContract } from '../blockchainFunctions/ethereumFunctions';

export default function Card({ loan, creator, walletType, blockchain, bitCoinValue }) {
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
            <Status status={loan.raw.status}></Status>
          </Flex>
          <TableContainer width={250}>
            <Table
              size='sm'
              variant='unstyled'>
              <Tbody>
                <Tr>
                  <Td>
                    <Text variant='property'>UUID</Text>
                  </Td>
                  <Td>
                    <Text>{easyTruncateAddress(loan.formatted.formattedUUID)}</Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Text variant='property'>Owner</Text>
                  </Td>
                  <Td>
                    <Text>{easyTruncateAddress(loan.raw.owner)}</Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Text variant='property'>Vault Collateral</Text>
                  </Td>
                  <Td>
                    <Text>{loan.formatted.formattedVaultCollateral}</Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Text variant='property'>Vault Loan</Text>
                  </Td>
                  <Td>
                    <Text>{loan.formatted.formattedVaultLoan}</Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Text variant='property'>Liquidation Fee</Text>
                  </Td>
                  <Td>
                    <Text>{loan.formatted.formattedLiquidationFee}</Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Text variant='property'>Liquidation Ratio</Text>
                  </Td>
                  <Td>
                    <Text>{loan.formatted.formattedLiquidationRatio}</Text>
                  </Td>
                </Tr>
                {loan.formatted.formattedClosingPrice && (
                  <Tr>
                    <Td>
                      <Text variant='property'>Closing Price</Text>
                    </Td>
                    <Td>
                      <Text>{loan.formatted.formattedClosingPrice}</Text>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
          <Flex>
            {loan.raw.status === 'ready' && (
              <VStack>
                <Button
                  variant='outline'
                  onClick={lockBTC}>
                  LOCK BTC
                </Button>
              </VStack>
            )}
            {loan.raw.status === ('not-ready' || 'pre-liquidated' || 'pre-paid') && (
              <Button
                _hover={{
                  shadow: 'none',
                }}
                isLoading
                loadingText='PENDING'
                color='gray'
                variant='outline'></Button>
            )}
            {loan.raw.status === 'funded' && (
              <VStack>
                  <Button
                    variant='outline'
                    onClick={() => setRepayModalOpen(true)}>
                    REPAY LOAN
                  </Button>
              </VStack>
            )}
          </Flex>
        </VStack>
      </Flex>
      <RepayModal
        isOpen={isRepayModalOpen}
        closeModal={onRepayModalClose}
        walletType={walletType}
        vaultLoanAmount={loan.raw.vaultLoan}
        BTCDeposit={loan.raw.vaultCollateral}
        uuid={loan.raw.dlcUUID}
        creator={creator}
        blockchain={blockchain}></RepayModal>
    </>
  );
}
