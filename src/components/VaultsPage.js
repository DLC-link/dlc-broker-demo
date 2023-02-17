import React, { useEffect, useState } from 'react';
import { Text, Collapse, VStack, IconButton, HStack } from '@chakra-ui/react';
import { RepeatClockIcon } from '@chakra-ui/icons';
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
    fetchBitcoinPrice().then((bitcoinPrice) => setBitCoinValue(bitcoinPrice));
    refreshVaultsTable(false);
    eventBus.on('vault-event', (data) => {
      if (data.status === 'setup') {
        initialVaults.shift();
      } else if (data.status === 'initialized') {
        initialVaults.push(data.vaultContract);
      }
      refreshVaultsTable(true);
    });
  }, []);

  const fetchAllVaults = async () => {
    let vaults = [];
    let sortedVaults = [];
    switch (walletType) {
      case 'metamask':
        vaults = await getAllVaultAndNFTDataForAddress(address);
        break;
      default:
        console.error('Unsupported wallet type!');
        break;
    }
    const pendingVaults = vaults.filter((vault) => [0, 1, 5, 7].includes(vault.raw.status));
    const readyVaults = vaults.filter((vault) => vault.raw.status === 2);
    const fundedVaults = vaults.filter((vault) => vault.raw.status === 3);
    const nftIssuedVaults = vaults.filter((vault) => vault.raw.status === 4);
    const closedVaults = vaults.filter((vault) => [6, 8].includes(vault.raw.status));
    sortedVaults = [...nftIssuedVaults, ...fundedVaults, ...readyVaults, ...pendingVaults, ...closedVaults];
    eventBus.dispatch('vaults', vaults)
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
