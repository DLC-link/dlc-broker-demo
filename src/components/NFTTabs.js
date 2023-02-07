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
  Table,
  TableContainer,
  Thead,
  Tbody,
  Th,
  Td,
  Tr,
  TableCaption,
  Image,
} from '@chakra-ui/react';
import { RepeatClockIcon } from '@chakra-ui/icons';
import MyContractsTable from './MyContractsTable';
import Balance from './Balance';
import LiquidatableContractsTable from './LiquidatableContractsTable';
import eventBus from '../EventBus';
import { getEthereumLoans } from '../blockchainFunctions/ethereumFunctions';
import { testContractArray } from '../testContractArray';

export default function NFTTabs({ isConnected, address, walletType, blockchain, depositAmount, nftQuantity }) {
  const [bitCoinValue, setBitCoinValue] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [isManualLoading, setManualLoading] = useState(undefined);
  const [initialLoans, setInitialLoans] = useState([]);
  const [loans, setLoans] = useState([]);

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
    return loans;
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
    eventBus.dispatch('change-nft-quantity', {
      nftQuantity: loans.length,
    });
  };

  const refreshLoansTable = (isManual) => {
    setManualLoading(isManual);
    setLoading(true);
    eventBus.dispatch('set-loading-state', { isLoading: true });
    fetchAllLoans()
      .then((loans) => {
        setLoans(loans);
        countBalance(loans);
      })
      .then(() => {
        setLoading(false);
        eventBus.dispatch('set-loading-state', { isLoading: false });
      });
  };

  return (
    <>
      <Collapse in={isConnected}>
        <VStack marginBottom='50px'>
          <HStack justifyContent='center'>
            <IconButton
              _hover={{
                color: 'accent',
                borderColor: 'accent',
                transform: 'translateY(-2.5px)',
              }}
              isLoading={isLoading && isManualLoading}
              variant='outline'
              borderRadius='full'
              borderColor='white'
              color='white'
              width='25px'
              height='25px'
              onClick={() => refreshLoansTable(true)}>
              <RepeatClockIcon color='inherit'></RepeatClockIcon>
            </IconButton>
            <Text
              fontWeight='extrabold'
              fontSize='3xl'>
              NFT CONTRACTS
            </Text>
          </HStack>
          <Balance
            isConnected={isConnected}
            depositAmount={depositAmount}
            nftQuantity={nftQuantity}></Balance>
        </VStack>
        <MyContractsTable
          loans={loans}
          initialLoans={initialLoans}
          isConnected={isConnected}
          walletType={walletType}
          address={address}
          blockchain={blockchain}
          isLoading={isLoading}
          bitCoinValue={bitCoinValue}></MyContractsTable>
      </Collapse>
    </>
  );
}
