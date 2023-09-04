import { useSelector } from 'react-redux';

import { Box } from '@chakra-ui/react';

import React from 'react';
import CustomToastHandler from './components/CustomToastHandler';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import VaultsPage from './components/VaultsPage';
import ModalContainer from './modals/ModalContainer';

import useTutorialStep from './hooks/useTutorialUpdater';

export default function App() {
    useTutorialStep();

    const { address: currentAddress } = useSelector((state) => state.account);

    return (
        <>
            <Box>
                <Header />
                <LandingPage />
                {currentAddress && <VaultsPage />}
            </Box>
            <ModalContainer />
            <CustomToastHandler />
        </>
    );
}
