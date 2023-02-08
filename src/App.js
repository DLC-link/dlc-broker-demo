import SelectWalletModal from './modals/SelectWalletModal';
import eventBus from './EventBus';
import Header from './components/Header';
import Intro from './components/Intro';
import React, { useEffect } from 'react';
import DepositModal from './modals/DepositModal';
import { Box, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import CustomToast from './components/CustomToast';
import NFTTabs from './components/NFTTabs';
import { customShiftValue } from './utilities/format';

export default function App() {
  const [isConnected, setConnected] = useState(false);
  const [address, setAddress] = useState(undefined);
  const [walletType, setWalletType] = useState(undefined);
  const [isLoading, setLoading] = useState(true);
  const [isSelectWalletModalOpen, setSelectWalletModalOpen] = useState(false);
  const [isDepositModalOpen, setDepositModalOpen] = useState(false);
  const [blockchain, setBlockchain] = useState(undefined);
  const [depositAmount, setDepositAmount] = useState(undefined);
  const [nftQuantity, setNftQuantity] = useState(undefined);
  const [walletBalance, setWalletBalance] = useState(3.5)
  const toast = useToast();

  const handleEvent = (data) => {
    if (data.status === 'created') {
      onDepositModalClose();
    }
    if (!toast.isActive(data.status)) {
      return toast({
        id: data.status,
        position: 'right-top',
        render: () => (
          <CustomToast
            data={data}
            walletType={walletType}></CustomToast>
        ),
      });
    }
  };

  useEffect(() => {
    eventBus.on('account-information', handleAccountInformation);
    eventBus.on('vault-event', (data) => handleEvent(data));
    eventBus.on('set-loading-state', (data) => setLoading(data.isLoading));
    eventBus.on('is-select-wallet-modal-open', (data) => setSelectWalletModalOpen(data.isSelectWalletOpen));
    eventBus.on('is-deposit-modal-open', (data) => setDepositModalOpen(data.isDepositOpen));
    eventBus.on('change-deposit-amount', (data) => setDepositAmount(customShiftValue(data.depositAmount, 8, true)));
    eventBus.on('change-nft-quantity', (data) => setNftQuantity(data.nftQuantity));
  }, []);

  const handleAccountInformation = (data) => {
    setConnected(!!data.walletType);
    setWalletType(data.walletType);
    setAddress(data.address);
    setBlockchain(data.blockchain);
  };

  const onSelectWalletModalClose = () => {
    setSelectWalletModalOpen(false);
  };

  const onDepositModalClose = () => {
    setDepositModalOpen(false);
  };

  return (
    <>
      <Box
        height='auto'
        padding={0}>
        <Header
          isConnected={isConnected}
          walletType={walletType}
          address={address}
          isLoading={isLoading}
          depositAmount={depositAmount}
          walletBalance={walletBalance}></Header>
        <DepositModal
          walletType={walletType}
          address={address}
          isOpen={isDepositModalOpen}
          closeModal={onDepositModalClose}
          blockchain={blockchain}
        />
        <SelectWalletModal
          isOpen={isSelectWalletModalOpen}
          closeModal={onSelectWalletModalClose}
        />
        <Intro isConnected={isConnected}></Intro>
        {isConnected && (
          <NFTTabs
            isConnected={isConnected}
            address={address}
            walletType={walletType}
            blockchain={blockchain}
            depositAmount={depositAmount}
            nftQuantity={nftQuantity}></NFTTabs>
        )}
      </Box>
    </>
  );
}
