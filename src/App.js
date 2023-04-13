import SelectWalletModal from './modals/SelectWalletModal';
import eventBus from './utilities/eventBus';
import Header from './components/Header';
import Intro from './components/Intro';
import React, { useEffect } from 'react';
import DepositModal from './modals/DepositModal';
import { Box, useToast } from '@chakra-ui/react';
import CustomToast from './components/CustomToast';
import VaultsPage from './components/VaultsPage';
import InfoModal from './modals/InfoModal';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { closeDepositModal } from './store/componentSlice';

export default function App() {
    const toast = useToast();
    const dispatch = useDispatch();
    const address = useSelector((state) => state.account.address);

    const handleEvent = (data) => {
        if (data.status === 'Initialized') {
            dispatch(closeDepositModal);
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
        eventBus.on('vault-event', (data) => handleEvent(data));
    }, []);

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
