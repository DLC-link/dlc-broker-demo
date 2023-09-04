import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import {
    HStack,
    Image,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    VStack,
    keyframes,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TutorialStep } from '../enums/TutorialSteps';
import { logout } from '../store/accountSlice';
import { toggleSelectWalletModalVisibility } from '../store/componentSlice';
import { easyTruncateAddress } from '../utilities/formatFunctions';
import TutorialBox from './TutorialBox';
import TutorialSwitch from './TutorialSwitch';

export default function Account() {
    const dispatch = useDispatch();

    const { address } = useSelector((state) => state.account);
    const { tutorialOn, tutorialStep } = useSelector((state) => state.tutorial);

    const [showTutorial, setShowTutorial] = useState(false);
    const [walletLogo, setWalletLogo] = useState(undefined);

    const walletType = useSelector((state) => state.account.walletType);

    const walletLogos = {
        metamask: {
            src: '/mm_logo.png',
            alt: 'Metamask Logo',
            boxSize: '25px',
        },
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

    useEffect(() => {
        const isTutorialStepMatches =
            tutorialStep === TutorialStep.CONNECTWALLET;
        setShowTutorial(tutorialOn && isTutorialStepMatches);
    }, [tutorialOn, tutorialStep]);

    useEffect(() => {
        const currentWalletLogo = walletLogos[walletType];
        setWalletLogo(currentWalletLogo);
    }, [walletType, tutorialStep]);

    const handleClick = () => {
        dispatch(toggleSelectWalletModalVisibility(true));
    };

    const DisconnectMenu = () => {
        return (
            <Menu>
                <MenuButton
                    height={50}
                    width={250}
                    borderRadius={'lg'}
                    shadow={'dark-lg'}
                    animation={
                        showTutorial
                            ? `
                                  ${glowAnimation} 5 1s
                              `
                            : ''
                    }
                >
                    <HStack>
                        {walletLogo && (
                            <Image
                                src={walletLogo.src}
                                alt={walletLogo.alt}
                                boxSize={walletLogo.boxSize}
                            />
                        )}
                        <CheckCircleIcon boxSize={15} color={'secondary1'} />
                        <Text fontSize={15}>
                            Account:{easyTruncateAddress(address)}
                        </Text>
                    </HStack>
                </MenuButton>
                <MenuList width={250}>
                    <MenuItem onClick={() => dispatch(logout())}>
                        Disconnect Wallet
                    </MenuItem>
                </MenuList>
            </Menu>
        );
    };

    const ConnectMenu = () => {
        return (
            <Menu>
                <MenuButton
                    height={50}
                    width={250}
                    borderRadius={'lg'}
                    shadow={'dark-lg'}
                    onClick={() => handleClick()}
                    animation={
                        showTutorial
                            ? `
                                  ${glowAnimation} 5 1s
                              `
                            : ''
                    }
                >
                    <HStack>
                        <WarningIcon boxSize={15} color={'secondary2'} />
                        <Text fontSize={15} fontWeight={'extrabold'}>
                            Connect Wallet
                        </Text>
                    </HStack>
                </MenuButton>
            </Menu>
        );
    };

    return (
        <VStack>
            <HStack>
                <TutorialSwitch tutorialStep={tutorialStep} />
                {address ? <DisconnectMenu /> : <ConnectMenu />}
            </HStack>
            {showTutorial && <TutorialBox tutorialStep={tutorialStep} />}
        </VStack>
    );
}
