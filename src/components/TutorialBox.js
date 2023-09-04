import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';
import { VStack, Text } from '@chakra-ui/react';
import { keyframes } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { TutorialStep } from '../enums/TutorialSteps';
import { useEffect, useState } from 'react';

export default function TutorialBox() {
    const { tutorialStep } = useSelector((state) => state.tutorial);
    const [arrowDirection, setArrowDirection] = useState(undefined);

    const bounceAnimation = keyframes`
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0);
    }
    }
    `;

    useEffect(() => {
        setArrowDirection(
            [
                TutorialStep.CONNECTWALLET,
                TutorialStep.SETUPVAULT,
                TutorialStep.SETCOLLATERAL,
                TutorialStep.WAITFORSETUP,
                TutorialStep.FUNDVAULT,
                TutorialStep.WAITFORCONFIRMATION,
                TutorialStep.MINTNFT,
                TutorialStep.APPROVENFT,
                TutorialStep.WAITFORCLOSE,
                TutorialStep.CLOSEVAULT,
            ].includes(tutorialStep)
                ? 'up'
                : 'down'
        );
    }, [tutorialStep]);

    const TutorialTextMap = {
        ConnectWallet:
            "Welcome to DLC.Link's Router Demo! Please connect your Metamask account to proceed. Note that a Leather account is required.",

        SelectNetwork:
            'Begin by choosing a network for establishing a connection.',

        SetupVault:
            "You're now connected! Let's set up a vault on your chosen network. Let's begin!",

        SetCollateral:
            "You'll select the amount of BTC to use as collateral. Click the 'Request Vault' button to configure your vault. Metamask will prompt you for confirmation.",

        WaitForSetup:
            "We're almost there! Your vault setup is in progress. Please wait for confirmation.",

        FundVault:
            "Your vault is now ready. To proceed, simply click 'Lock BTC' to utilize your BTC as collateral for the DLC. Leather will request confirmation.",

        WaitForConfirmation:
            'Your vault is being funded. Kindly wait for confirmation.',

        MintNFT:
            'Your vault is funded, and an NFT is being minted. Please wait for confirmation.',

        ApproveNFT:
            'Congratulations, your NFT has been successfully minted! You can now use it to borrow. To close your vault, you must first approve NFT burning.',

        WaitForClose:
            'Your vault is being closed. Please wait for confirmation.',

        CloseVault:
            "Your vault is ready to be closed. To initiate, click 'Close Vault'.",

        EndFlow:
            "Congratulations! You've successfully closed your vault, and your BTC has been returned to your wallet.",
    };

    const TutorialInfo = () => {
        return (
            <VStack>
                <Text
                    fontSize={10}
                    fontWeight={'extrabold'}
                    textAlign={'justify'}
                >
                    {TutorialTextMap[tutorialStep]}
                </Text>
            </VStack>
        );
    };

    return (
        <VStack
            animation={`
        ${bounceAnimation} infinite 1s
       
    `}
        >
            {arrowDirection === 'up' && <ArrowUpIcon color={'secondary1'} />}
            <VStack
                width={225}
                padding={2.5}
                background={'rgba(4, 186, 178, 0.65)'}
                border={'1px solid #07E8D8'}
                borderRadius={'lg'}
            >
                <TutorialInfo />
            </VStack>
            {arrowDirection === 'down' && (
                <ArrowDownIcon color={'secondary1'} />
            )}
        </VStack>
    );
}
