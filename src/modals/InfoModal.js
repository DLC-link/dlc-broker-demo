import {
    VStack,
    HStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    FormHelperText,
    FormErrorMessage,
    NumberInput,
    NumberInputField,
    Flex,
    Text,
    Image,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
    customShiftValue,
    formatCollateralInUSD,
} from '../utilities/formatFunctions';
import { setupVault } from '../blockchainFunctions/ethereumFunctions';
import { fetchBitcoinPrice } from '../blockchainFunctions/bitcoinFunctions';

export default function InfoModal({ isOpen }) {
    return (
        <Modal isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent
                width="350px"
                border="1px"
                bg="background2"
                color="accent"
            >
                <VStack>
                    <ModalHeader color="white">
                        Switching Ethereum Network
                    </ModalHeader>
                    <ModalBody>
                        <Text margin="5px" fontSize="x-small" color="accent">
                            After the network switch is accepted, the page will
                            reload.
                        </Text>
                    </ModalBody>
                </VStack>
            </ModalContent>
        </Modal>
    );
}
