import React, { useEffect, useState } from 'react';
import { Text, Collapse, VStack, IconButton, HStack } from '@chakra-ui/react';
import VaultsGrid from './VaultsGrid';
import Balance from './Balance';
import eventBus from '../utilities/eventBus';
import { getAllVaultAndNFTDataForAddress } from '../blockchainFunctions/ethereumFunctions';
import { fetchBitcoinPrice } from '../blockchainFunctions/bitcoinFunctions';
import { RefreshOutlined } from '@mui/icons-material';
import { filter, map, sum, pipe, length} from 'ramda';

export default function VaultsPage({ isConnected, address, walletType, blockchain, depositAmount, nftQuantity }) {
  const [bitcoinValue, setBitcoinValue] = useState(0);
  const [isLoading, setLoading] = useState([false, false]);
  const [initialVaults, setInitialVaults] = useState([]);
  const [vaults, setVaults] = useState([]);

  useEffect(() => {
    refreshVaultsTable();
    const handleVaultEvent = (event) => {
      switch (event.status) {
        case 'setup':
          initialVaults.shift();
          break;
        case 'initialized':
          initialVaults.push(event.vaultContract);
          break;
        default:
          break;
      }
      refreshVaultsTable();
    };

    const fetchData = async () => {
      try {
        const bitcoinPrice = await fetchBitcoinPrice();
        setBitcoinValue(bitcoinPrice);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    eventBus.on('vault-event', handleVaultEvent);
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
    eventBus.dispatch('vaults', vaults);
    const sortStatusOrder = [0, 4, 3, 2, 1, 5, 7, 6, 8];
    const sortedVaults = vaults.sort(
      (a, b) => sortStatusOrder.indexOf(a.raw.status) - sortStatusOrder.indexOf(b.raw.status)
    );
    return sortedVaults;
  };

  const countBalance = (vaults) => {
    const sumDepositAmount = pipe(
      filter((vault) => [3, 4].includes(vault.raw.status)),
      map((vault) => vault.raw.vaultCollateral),
      sum
    );

    const countNFTQuantity = pipe(
      filter((vault) => vault.raw.status === 4),
      length
    );

    const depositAmount = sumDepositAmount(vaults);
    const nftQuantity = countNFTQuantity(vaults);

    eventBus.dispatch('change-deposit-amount', {
      depositAmount: depositAmount,
    });
    eventBus.dispatch('change-nft-quantity', {
      nftQuantity: nftQuantity,
    });
  };

  const refreshVaultsTable = async (isManual) => {
    setLoading([true, isManual]);
    fetchAllVaults()
      .then((vaults) => {
        setVaults(vaults);
        countBalance(vaults);
      })
      .then(() => {
        setLoading(false, false);
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
              isLoading={isLoading[0] && isLoading[1]}
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
          isLoading={isLoading[0]}
          isConnected={isConnected}
          walletType={walletType}
          address={address}
          blockchain={blockchain}
          initialVaults={initialVaults}
          vaults={vaults}
          bitcoinValue={bitcoinValue}></VaultsGrid>
      </Collapse>
    </>
  );
}
