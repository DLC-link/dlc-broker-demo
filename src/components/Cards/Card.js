/*global chrome*/

import {
    Button,
    Flex,
    Image,
    Spacer,
    Spinner,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Tooltip,
    Tr,
    VStack,
    keyframes,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TutorialStep } from '../../enums/TutorialSteps';
import { vaultStatuses } from '../../enums/VaultStatuses';
import { easyTruncateAddress } from '../../utilities/formatFunctions';
import { ActionButtons } from '../ActionButtons';
import Status from '../Status';
import TutorialBox from '../TutorialBox';
export default function Card({ vault }) {
    const [showTutorial, setShowTutorial] = useState(false);

    const { tutorialOn, tutorialStep, tutorialVaultUUID } = useSelector(
        (state) => state.tutorial
    );

    useEffect(() => {
        const isTutorialVaultUUIDMatches = tutorialVaultUUID === vault.uuid;
        const isTutorialStepMatches = [
            TutorialStep.WAITFORSETUP,
            TutorialStep.FUNDVAULT,
            TutorialStep.WAITFORCONFIRMATION,
            TutorialStep.MINTNFT,
            TutorialStep.APPROVENFT,
            TutorialStep.CLOSEVAULT,
            TutorialStep.ENDFLOW,
        ].includes(tutorialStep);
        const shouldShowTutorial =
            tutorialOn && isTutorialVaultUUIDMatches && isTutorialStepMatches;
        setShowTutorial(shouldShowTutorial);
    }, [tutorialOn, tutorialStep, tutorialVaultUUID, vault.uuid, vault.status]);

    const backgroundColor = vault.isUserCreated
        ? 'linear(to-br, background1, transparent)'
        : 'linear(to-br, background2, transparent)';

    const cardInfo = [
        { label: 'UUID', value: vault.uuid && easyTruncateAddress(vault.uuid) },
        { label: 'Creator', value: easyTruncateAddress(vault.owner) },
        { label: 'Vault Collateral', value: vault.formattedCollateral },
    ];

    const cardAnimationInitialState = {
        x: -300,
        border: '5px dashed rgba(255,255,255, 0.1)',
        borderRadius: '25px',
    };

    const cardAnimationMotionState = {
        x: 0,
        border: '0px',
    };

    const cardAnimationExitState = {
        x: 300,
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

    const CardAnimation = ({ children }) => {
        return (
            <motion.div
                whileHover={{
                    scale: 1.025,
                    transition: { duration: 0.5 },
                }}
                initial={cardAnimationInitialState}
                animate={cardAnimationMotionState}
                exit={cardAnimationExitState}
            >
                {children}
            </motion.div>
        );
    };

    const CardContainer = ({ children }) => {
        return (
            <VStack
                height={500}
                width={250}
                borderRadius="lg"
                shadow="dark-lg"
                padding={2.5}
                bgGradient={backgroundColor}
                backgroundPosition="right"
                backgroundSize="200%"
                transition="background-position 500ms ease"
                animation={
                    showTutorial
                        ? `
                ${glowAnimation} infinite 1s
            `
                        : ''
                }
                justifyContent="center"
                _hover={{
                    backgroundPosition: 'left',
                }}
            >
                {children}
            </VStack>
        );
    };

    const CardTable = () => {
        return (
            <TableContainer>
                <Table variant="unstyled" size={'sm'} maxWidth={'100%'}>
                    <Tbody>
                        {cardInfo.map((row, index) => (
                            <Tr key={index}>
                                <Td padding={0} width={'full'}>
                                    <Text>{row.label}</Text>
                                </Td>
                                <Td>
                                    {row.label === 'UUID' ? (
                                        <Button
                                            variant={'uuid'}
                                            onClick={() =>
                                                navigator.clipboard.writeText(
                                                    vault.uuid
                                                )
                                            }
                                        >
                                            <Tooltip
                                                label={'Click to copy UUID'}
                                                placement={'top'}
                                            >
                                                <Text variant="value">
                                                    {row.value}
                                                </Text>
                                            </Tooltip>
                                        </Button>
                                    ) : (
                                        <Text variant={'value'}>
                                            {row.value}
                                        </Text>
                                    )}
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        );
    };

    const CardSpinner = () => {
        return (
            <Flex padding={50}>
                <Spinner
                    thickness={5}
                    speed="1s"
                    emptyColor="transparent"
                    color="accent"
                    size="xl"
                />
            </Flex>
        );
    };

    const NFTContainer = () => {
        return (
            <Flex>
                <Image
                    src={vault.nftImageURL}
                    alt="NFT"
                    margin="0px"
                    shadow="dark-lg"
                    boxSize="200px"
                />
            </Flex>
        );
    };

    return (
        <CardAnimation>
            <CardContainer>
                <Status
                    status={vault.status}
                    isCreator={vault.isUserCreated}
                    txHash={vault.txHash}
                />
                <CardTable />
                <Spacer />
                {vault.status === vaultStatuses.NONE && <CardSpinner />}
                {vault.status === 'NftIssued' && <NFTContainer />}
                <ActionButtons vault={vault} />
            </CardContainer>
            {showTutorial && <TutorialBox tutorialStep={tutorialStep} />}
        </CardAnimation>
    );
}
