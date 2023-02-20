import React, { useEffect, useState } from 'react';
import { Text, Collapse, VStack, IconButton, HStack } from '@chakra-ui/react';
import VaultsGrid from './VaultsGrid';
import Balance from './Balance';
import eventBus from '../utilities/eventBus';
import { getAllVaultAndNFTDataForAddress } from '../blockchainFunctions/ethereumFunctions';
import { fetchBitcoinPrice } from '../blockchainFunctions/bitcoinFunctions';
import { RefreshOutlined } from '@mui/icons-material';

export default function VaultsPage({ isConnected, address, walletType, blockchain, depositAmount, nftQuantity }) {
  const [bitCoinValue, setBitCoinValue] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [isManualLoading, setManualLoading] = useState(undefined);
  const [initialVaults, setInitialVaults] = useState([]);
  const [vaults, setVaults] = useState([]);

  useEffect(() => {
    refreshVaultsTable(false);
    fetchBitcoinPrice().then((bitcoinPrice) => setBitCoinValue(bitcoinPrice));
    eventBus.on('vault-event', (event) => {
      switch (event.status) {
        case 'setup':
          initialVaults.shift();
          refreshVaultsTable(true);
          break;
        case 'initialized':
          initialVaults.push(event.vaultContract);
          refreshVaultsTable(true);
          break;
        case 'refresh':
          refreshVaultsTable(true);
          break;
      }
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

    const sortStatusOrder = [0, 4, 3, 2, 1, 5, 7, 6, 8];
    const sortedVaults = vaults.sort(
      (a, b) => sortStatusOrder.indexOf(a.raw.status) - sortStatusOrder.indexOf(b.raw.status)
    );

    eventBus.dispatch('vaults', vaults);
    return sortedVaults;
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

  const refreshVaultsTable = async (isManual) => {
    setManualLoading(isManual);
    setLoading(true);
    setVaults([]);
    const vaults = await fetchAllVaults();
    console.log(vaults)
    setVaults(vaults);
    countBalance(vaults);
    setLoading(false);
  };

  return (
    <>
      <Collapse in={isConnected}>
        <VStack marginBottom='50px'>
          <HStack justifyContent='center'>
            <IconButton
              _hover={{
                borderColor: 'accent',
                color: 'accent',
                transform: 'translateY(-2.5px)',
              }}
              variant='outline'
              isLoading={isLoading && isManualLoading}
              marginLeft='0px'
              height='35px'
              width='35px'
              borderRadius='lg'
              borderColor='white'
              color='white'
              icon={<RefreshOutlined color='inherit'></RefreshOutlined>}
              onClick={() => refreshVaultsTable(true)}></IconButton>
            <Text
              fontSize='3xl'
              fontWeight='extrabold'>
              BITCOIN VAULTS
            </Text>
          </HStack>
          <Balance
            isConnected={isConnected}
            depositAmount={depositAmount}
            nftQuantity={nftQuantity}></Balance>
        </VStack>
        <VaultsGrid
          isLoading={isLoading}
          isConnected={isConnected}
          walletType={walletType}
          address={address}
          blockchain={blockchain}
          initialVaults={initialVaults}
          vaults={vaults}
          bitCoinValue={bitCoinValue}></VaultsGrid>
      </Collapse>
    </>
  );
}
