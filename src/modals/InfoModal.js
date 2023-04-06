import {
    VStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    Text,
} from '@chakra-ui/react';

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
