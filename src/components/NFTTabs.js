import React, { useEffect, useState } from 'react';
import { Text, Collapse, VStack, IconButton, HStack } from '@chakra-ui/react';
import { RepeatClockIcon } from '@chakra-ui/icons';
import MyContractsTable from './MyContractsTable';
import Balance from './Balance';
import eventBus from '../EventBus';
import { getAllVaultAndNFTDataForAddress } from '../blockchainFunctions/ethereumFunctions';
import { fetchBitcoinPrice } from '../blockchainFunctions/bitcoinFunctions';
import { RefreshOutlined } from '@mui/icons-material';

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
      } else if (data.status === 'initialized') {
        initialVaults.push(data.vaultContract);
      }
      refreshVaultsTable(true);
    });
  }, []);

  const fetchAllVaults = async () => {
    let vaults = [];
    switch (walletType) {
      case 'metamask':
        const allVaults = await getAllVaultAndNFTDataForAddress(address);
        const pendingVaults = allVaults.filter((vault) => [0, 1, 5, 7].includes(vault.raw.status));
        const readyVaults = allVaults.filter((vault) => vault.raw.status === 2);
        const fundedVaults = allVaults.filter((vault) => vault.raw.status === 3);
        const nftIssuedVaults = allVaults.filter((vault) => vault.raw.status === 4);
        const closedVaults = allVaults.filter((vault) => [6, 8].includes(vault.raw.status));
        vaults = [...nftIssuedVaults, ...fundedVaults, ...readyVaults, ...pendingVaults, ...closedVaults];
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
              borderRadius='lg'
              borderColor='white'
              color='white'
              marginLeft='0px'
              width='35px'
              height='35px'
              icon={<RefreshOutlined color='inherit'></RefreshOutlined>}
              onClick={() => refreshVaultsTable(true)}></IconButton>
            <Text
              fontWeight='extrabold'
              fontSize='3xl'>
              BITCOIN VAULTS
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
