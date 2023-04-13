import {
    VStack,
    HStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Text,
    MenuButton,
    MenuItem,
    MenuList,
    Menu,
} from '@chakra-ui/react';
import { Image } from '@chakra-ui/react';
import { requestAndDispatchMetaMaskAccountInformation } from '../blockchainFunctions/ethereumFunctions';
import { useSelector } from 'react-redux';
import { closeSelectWalletModal } from '../store/componentSlice';
import { useDispatch } from 'react-redux';

export default function SelectWalletModal() {
    const isSelectWalletModalOpen = useSelector((state) => state.component.isSelectWalletModalOpen);
    const dispatch = useDispatch();

    const blockchains = [
        { id: 11155111, name: 'Sepolia Testnet' },
        { id: 5, name: 'Goerli Testnet' },
        { id: 31337, name: 'Localhost' },
    ];

    return (
        <Modal isOpen={isSelectWalletModalOpen} onClose={() => dispatch(closeSelectWalletModal())} isCentered>
            <ModalOverlay />
            <ModalContent
                width="300px"
                border="1px"
                bg="background2"
                color="accent"
            >
                <ModalHeader color="white" textAlign="center">
                    Select Wallet
                </ModalHeader>
                <ModalCloseButton
                    _focus={{
                        boxShadow: 'none',
                    }}
                />
                <ModalBody padding="25px">
                    <VStack>
                        <Menu>
                            {({ isOpen }) => (
                                <>
                                    <MenuButton variant="outline">
                                        <HStack justifyContent="center">
                                            <Image
                                                src="/mm_logo.png"
                                                alt="Metamask Logo"
                                                boxSize="25px"
                                            />
                                            <Text variant="selector">
                                                {isOpen
                                                    ? 'Choose Network'
                                                    : 'Metamask'}
                                            </Text>
                                        </HStack>
                                    </MenuButton>
                                    <MenuList>
                                        {blockchains.map((blockchain, i) => {
                                            return (
                                                <MenuItem
                                                    key={i}
                                                    onClick={() => {
                                                        requestAndDispatchMetaMaskAccountInformation(
                                                            blockchain.id
                                                        );
                                                        dispatch(closeSelectWalletModal())
                                                    }}
                                                >
                                                    {blockchain.name}
                                                </MenuItem>
                                            );
                                        })}
                                    </MenuList>
                                </>
                            )}
                        </Menu>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
