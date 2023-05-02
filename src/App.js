import SelectWalletModal from './modals/SelectWalletModal';
import Header from './components/Header';
import Intro from './components/Intro';
import React, { useEffect } from 'react';
import DepositModal from './modals/DepositModal';
import { Box } from '@chakra-ui/react';

import VaultsPage from './components/VaultsPage';
import InfoModal from './modals/InfoModal';
import CustomToast from './components/CustomToast';
import { useSelector } from 'react-redux';
import { useToast } from '@chakra-ui/react';

export default function App() {
    const toast = useToast();

    const address = useSelector((state) => state.account.address);
    const blockchain = useSelector((state) => state.account.blockchain);
    const toastEvent = useSelector((state) => state.vaults.toastEvent);

    const handleToast = (toastEvent) => {
        if (!toast.isActive(toastEvent.status)) {
            return toast({
                id: toastEvent.status,
                render: () => (
                    <CustomToast
                        txHash={toastEvent.txHash}
                        blockchain={blockchain}
                        status={toastEvent.status}
                    ></CustomToast>
                ),
            });
        }
    };

    useEffect(() => {
        if (toastEvent !== null) {
            handleToast(toastEvent);
        }
    }, [toastEvent]);

    return (
        <>
            <Box>
                <Header></Header>
                <DepositModal />
                <SelectWalletModal />
                <InfoModal></InfoModal>
                <Intro></Intro>
                {address && <VaultsPage></VaultsPage>}
            </Box>
        </>
    );
}
