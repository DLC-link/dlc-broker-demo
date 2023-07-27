import Header from './components/Header';
import Intro from './components/Intro';
import React from 'react';
import { Box } from '@chakra-ui/react';

export default function App() {

    return (
        <>
            <Box>
                <Header></Header>
                <Intro></Intro>
            </Box>
        </>
    );
}
