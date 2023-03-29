import SelectWalletModal from './modals/SelectWalletModal';
import eventBus from './utilities/eventBus';
import Header from './components/Header';
import Intro from './components/Intro';
import React, { useEffect } from 'react';
import DepositModal from './modals/DepositModal';
import { Box, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import CustomToast from './components/CustomToast';
import VaultsPage from './components/VaultsPage';
import { setEthereumProvider } from './blockchainFunctions/ethereumFunctions';
import { startEthObserver } from './observer';
import InfoModal from './modals/InfoModal';

export default function App() {
    const [isConnected, setConnected] = useState(false);
    const [address, setAddress] = useState(undefined);
    const [walletType, setWalletType] = useState(undefined);
    const [isSelectWalletModalOpen, setSelectWalletModalOpen] = useState(false);
    const [isDepositModalOpen, setDepositModalOpen] = useState(false);
    const [isInfoModalOpen, setInfoModalOpen] = useState(false);
    const [blockchain, setBlockchain] = useState(undefined);
    const [isProviderSet, setProvider] = useState(false);
    const toast = useToast();

    const handleEvent = (data) => {
        if (data.status === 'Initialized') {
            onDepositModalClose();
        }
        if (!toast.isActive(data.status)) {
            const isMobile = window.innerWidth <= 768;
            return toast({
                id: data.status,
                position: isMobile ? 'bottom' : 'top-right',
                render: () => (
                    <CustomToast data={data} isMobile={isMobile}></CustomToast>
                ),
            });
        }
    };

    useEffect(() => {
        async function setup() {
            setEthereumProvider().then(() => {
                setProvider(true);
                startEthObserver();
                console.log('Ethereum provider and contracts set!');
            });
        }
        if (blockchain !== undefined) {
            setup();
        }
    }, [blockchain]);

    useEffect(() => {
        eventBus.on('account-information', handleAccountInformation);
        eventBus.on('vault-event', (data) => handleEvent(data));
        eventBus.on('provider', (data) => setProvider(data));
        eventBus.on('is-select-wallet-modal-open', (data) =>
            setSelectWalletModalOpen(data.isSelectWalletOpen)
        );
        eventBus.on('is-info-modal-open', (data) =>
            setInfoModalOpen(data.isInfoModalOpen)
        );
        eventBus.on('is-deposit-modal-open', (data) =>
            setDepositModalOpen(data.isDepositOpen)
        );
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
            <Box>
                <Header
                    isConnected={isConnected}
                    walletType={walletType}
                    address={address}
                ></Header>
                <DepositModal
                    walletType={walletType}
                    address={address}
                    blockchain={blockchain}
                    isOpen={isDepositModalOpen}
                    closeModal={onDepositModalClose}
                />
                <SelectWalletModal
                    isOpen={isSelectWalletModalOpen}
                    closeModal={onSelectWalletModalClose}
                />
                <InfoModal isOpen={isInfoModalOpen}></InfoModal>
                <Intro isConnected={isConnected}></Intro>
                {isConnected && (
                    <VaultsPage
                        isConnected={isConnected}
                        isProviderSet={isProviderSet}
                        walletType={walletType}
                        address={address}
                        blockchain={blockchain}
                    ></VaultsPage>
                )}
            </Box>
        </>
    );
}
