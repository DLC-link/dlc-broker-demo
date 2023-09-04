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
import { toggleSelectWalletModalVisibility } from '../store/componentSlice';
import { useDispatch } from 'react-redux';
import { TutorialStep } from '../enums/TutorialSteps';
import { useEffect } from 'react';
import { useState } from 'react';
import TutorialBox from '../components/TutorialBox';
import { keyframes } from '@chakra-ui/react';

export default function SelectWalletModal() {
    const dispatch = useDispatch();

    const isSelectWalletModalOpen = useSelector(
        (state) => state.component.isSelectWalletModalOpen
    );
    const { tutorialOn, tutorialStep } = useSelector((state) => state.tutorial);

    const [showTutorial, setShowTutorial] = useState(false);

    const blockchains = [
        { id: 11155111, name: 'Sepolia Testnet' },
        { id: 5, name: 'Goerli Testnet' },
        { id: 31337, name: 'Localhost' },
    ];

    useEffect(() => {
        const isTutorialStepMatches =
            tutorialStep === TutorialStep.SELECTNETWORK;
        setShowTutorial(tutorialOn && isTutorialStepMatches);
    }, [tutorialOn, tutorialStep]);

    const handleClick = (blockchain) => {
        requestAndDispatchMetaMaskAccountInformation(blockchain.id);
        dispatch(toggleSelectWalletModalVisibility(false));
    };

    const glowAnimation = keyframes`
    0% {
        box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
    }
    50% {
        box-shadow: 0px 0px 100px rgba(7, 232, 216, 0.5);
    }
    100% {
        box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
    }
    }
    `;

    const SelectWalletModalContainer = () => {
        return (
            <Modal
                isOpen={isSelectWalletModalOpen}
                onClose={() =>
                    dispatch(toggleSelectWalletModalVisibility(false))
                }
                isCentered
            >
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
                            {showTutorial && (
                                <TutorialBox tutorialStep={tutorialStep} />
                            )}
                            <Menu>
                                {({ isOpen }) => (
                                    <>
                                        <MenuButton
                                            variant="outline"
                                            animation={
                                                showTutorial
                                                    ? `
                                                          ${glowAnimation} 5 1s
                                                      `
                                                    : ''
                                            }
                                        >
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
                                            {blockchains.map(
                                                (blockchain, i) => {
                                                    return (
                                                        <MenuItem
                                                            key={i}
                                                            onClick={() =>
                                                                handleClick(
                                                                    blockchain
                                                                )
                                                            }
                                                        >
                                                            {blockchain.name}
                                                        </MenuItem>
                                                    );
                                                }
                                            )}
                                        </MenuList>
                                    </>
                                )}
                            </Menu>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        );
    };

    return <SelectWalletModalContainer />;
}
