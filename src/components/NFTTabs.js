/*global chrome*/

import React, { useEffect, useState } from 'react';
import {
  Text,
  Collapse,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Box,
  VStack,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import { RepeatClockIcon } from '@chakra-ui/icons';
import MyContractsTable from './MyContractsTable';
import LiquidatableContractsTable from './LiquidatableContractsTable';
import eventBus from '../EventBus';
import { getEthereumLoans } from '../blockchainFunctions/ethereumFunctions';
import { testContractArray } from '../testContractArray';

export default function NFTTabs({ isConnected, address, walletType, blockchain }) {
  const [bitCoinValue, setBitCoinValue] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [isManualLoading, setManualLoading] = useState(undefined);
  const [initialLoans, setInitialLoans] = useState([]);
  const [depositedContracts, setDepositedContracts] = useState([]);
  const [liquidatableContracts, setLiquidatableContracts] = useState([]);

  useEffect(() => {
    fetchBitcoinValue().then((bitCoinValue) => setBitCoinValue(bitCoinValue));
    refreshLoansTable(false);
    eventBus.on('loan-event', (data) => {
      if (data.status === 'setup') {
        initialLoans.shift();
      }
      refreshLoansTable(true);
    });
    eventBus.on('create-loan', (data) => {
      initialLoans.push(data.loan);
    });
  }, []);

  useEffect(() => {
    refreshLoansTable(false);
  }, [initialLoans]);

  const fetchBitcoinValue = async () => {
    let bitCoinValue = undefined;
    await fetch('/.netlify/functions/get-bitcoin-price', {
      headers: { accept: 'Accept: application/json' },
    })
      .then((x) => x.json())
      .then(({ msg }) => (bitCoinValue = Number(msg.bpi.USD.rate.replace(/[^0-9.-]+/g, ''))));
    return bitCoinValue;
  };

  const fetchAllLoans = async () => {
    let loans = undefined;
    switch (walletType) {
      case 'metamask':
        // loans = getEthereumLoans(address);
        loans = testContractArray;
        break;
      default:
        console.error('Unsupported wallet type!');
        break;
    }
    return filterAllLoans(loans);
  };

  const filterAllLoans = (loans) => {
    const currentDepositedContracts = loans.filter((loan) => loan.depositor.toLowerCase() === address);
    const currentLiquidatableContracts = loans.filter((loan) => loan.depositor.toLowerCase() !== address);
    return { currentDepositedContracts, currentLiquidatableContracts };
  };

  const countBalance = (loans) => {
    let depositAmount = 0;
    for (const loan of loans) {
      if (loan.status === 'funded') {
        depositAmount += Number(loan.vaultCollateral);
      }
    }
    eventBus.dispatch('change-deposit-amount', {
      depositAmount: depositAmount,
    });
  };

  const refreshLoansTable = (isManual) => {
    setManualLoading(isManual);
    setLoading(true);
    eventBus.dispatch('set-loading-state', { isLoading: true });
    fetchAllLoans()
      .then(({ currentDepositedContracts, currentLiquidatableContracts }) => {
        setDepositedContracts(currentDepositedContracts);
        setLiquidatableContracts(currentLiquidatableContracts);
        countBalance(currentDepositedContracts);
      })
      .then(() => {
        setLoading(false);
        eventBus.dispatch('set-loading-state', { isLoading: false });
      });
  };

  return (
    <>
      <Collapse in={isConnected}>
        <Tabs
          isLazy
          size='md'
          align='center'
          defaultIndex={0}>
          <HStack justifyContent='center'>
            <IconButton
              _hover={{
  
                color: 'accent',
                borderColor: 'accent'
              }}
              isLoading={isLoading && isManualLoading}
              variant='outline'
              borderRadius='full'
              borderColor='white'
              color='white'
              width={[35, 45]}
              height={[35, 45]}
              onClick={() => refreshLoansTable(true)}>
              <RepeatClockIcon color='inherit'></RepeatClockIcon>
            </IconButton>
            <TabList>
              <Tab fontWeight='bold' fontSize='md'>MY CONTRACTS</Tab>
              <Tab fontWeight='bold' fontSize='md'>CONTRACTS TO LIQUIDATE</Tab>
            </TabList>
          </HStack>
          <TabPanels>
            <TabPanel>
              <MyContractsTable
                loans={depositedContracts}
                initialLoans={initialLoans}
                isConnected={isConnected}
                walletType={walletType}
                address={address}
                blockchain={blockchain}
                isLoading={isLoading}
                bitCoinValue={bitCoinValue}></MyContractsTable>
            </TabPanel>
            <TabPanel>
              <LiquidatableContractsTable
                loans={liquidatableContracts}
                isConnected={isConnected}
                walletType={walletType}
                address={address}
                blockchain={blockchain}
                isLoading={isLoading}
                bitCoinValue={bitCoinValue}></LiquidatableContractsTable>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Collapse>
    </>
  );
}
