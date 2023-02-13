import React, { useEffect, useState } from 'react';
import { Text, Collapse, VStack, IconButton, HStack } from '@chakra-ui/react';
import { RepeatClockIcon } from '@chakra-ui/icons';
import MyContractsTable from './MyContractsTable';
import Balance from './Balance';
import eventBus from '../EventBus';
import { getAllVaultAndNFTDataForAddress } from '../blockchainFunctions/ethereumFunctions';
import { fetchBitcoinPrice } from '../blockchainFunctions/bitcoinFunctions';

export default function NFTTabs({ isConnected, address, walletType, blockchain, depositAmount, nftQuantity }) {
  const [bitCoinValue, setBitCoinValue] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [isManualLoading, setManualLoading] = useState(undefined);
  const [initialVaults, setInitialVaults] = useState([]);
  const [vaults, setVaults] = useState([]);

  useEffect(() => {
    fetchBitcoinPrice().then((bitcoinPrice) => setBitCoinValue(bitcoinPrice));
    refreshVaultsTable(false);
    eventBus.on('vault-event', (data) => {
      if (data.status === 'setup') {
        initialVaults.shift();
      } else if (data.status === 'created') {
        console.log(data);
        initialVaults.push(data.vaultContract);
      }
      refreshVaultsTable(true);
    });
  }, []);

  const fetchAllVaults = async () => {
    let vaults = [];
    switch (walletType) {
      case 'metamask':
        vaults = await getAllVaultAndNFTDataForAddress(address);
        break;
      default:
        console.error('Unsupported wallet type!');
        break;
    }
    return vaults;
  };

  const countBalance = (vaults) => {
    let depositAmount = 0;
    let nftQuantity = 0;
    for (const vault of vaults) {
      if ([3, 4].includes(vault.raw.status)) {
        depositAmount += Number(vault.raw.vaultCollateral);
      }
      if (vault.raw.status === 4) {
        nftQuantity++;
      }
    }
    eventBus.dispatch('change-deposit-amount', {
      depositAmount: depositAmount,
    });
    eventBus.dispatch('change-nft-quantity', {
      nftQuantity: nftQuantity,
    });
  };

  const refreshVaultsTable = (isManual) => {
    setManualLoading(isManual);
    setLoading(true);
    eventBus.dispatch('set-loading-state', { isLoading: true });
    fetchAllVaults()
      .then((vaults) => {
        setVaults(vaults);
        countBalance(vaults);
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
              padding='10px'
              color='white'
              width='25px'
              height='25px'
              onClick={() => refreshVaultsTable(true)}>
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
          vaults={vaults}
          initialVaults={initialVaults}
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
