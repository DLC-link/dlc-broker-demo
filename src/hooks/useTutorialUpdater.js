import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TutorialStep } from '../enums/TutorialSteps';
import { vaultStatuses } from '../enums/VaultStatuses';
import {
    setTutorialOn,
    setTutorialStep,
    toggleFirstTimeUser,
} from '../store/tutorialSlice';
import { selectVaultByUUID } from '../store/vaultsSlice';
import { setTutorialVaultUUID } from '../store/tutorialSlice';
import { useOnMount } from './useOnMount';

export default function useTutorialStep() {
    const dispatch = useDispatch();

    const { isFirstTimeUser, tutorialStep } = useSelector(
        (state) => state.tutorial
    );

    const { vaultsWithBTCTransactions } = useSelector((state) => state.vaults);

    const isDepositModalOpen = useSelector(
        (state) => state.component.isDepositModalOpen
    );
    const isSelectWalletModalOpen = useSelector(
        (state) => state.component.isSelectWalletModalOpen
    );

    const currentUserAddress = useSelector((state) => state.account.address);

    const currentVaults = useSelector((state) => state.vaults.vaults);

    const currentTutorialVaultUUID = useSelector(
        (state) => state.tutorial.tutorialVaultUUID
    );
    const currentTutorialVault = useSelector((state) =>
        selectVaultByUUID(state, currentTutorialVaultUUID)
    );

    useOnMount(() => {
        if (isFirstTimeUser) {
            dispatch(setTutorialOn(true));
        } else {
            dispatch(setTutorialOn(false));
        }
    });

    useEffect(() => {
        if (!currentUserAddress) {
            if (isSelectWalletModalOpen) {
                dispatch(setTutorialStep(TutorialStep.SELECTNETWORK));
            } else {
                dispatch(setTutorialStep(TutorialStep.CONNECTWALLET));
            }
        } else if (currentTutorialVaultUUID === '-') {
            if (isDepositModalOpen) {
                dispatch(setTutorialStep(TutorialStep.SETCOLLATERAL));
            } else if (
                searchForVaultWithStatus(vaultStatuses.NONE) &&
                tutorialStep !== TutorialStep.SETCOLLATERAL
            ) {
                const vaultWithStatusNone = searchForVaultWithStatus(
                    vaultStatuses.NONE
                );
                decideAndDispatchTutorialStepOnVaultStatusChange(
                    vaultWithStatusNone
                );
            } else if (
                searchForVaultWithStatus(vaultStatuses.READY) &&
                tutorialStep === TutorialStep.WAITFORSETUP
            ) {
                const vaultWithStatusReady = searchForVaultWithStatus(
                    vaultStatuses.READY
                );
                decideAndDispatchTutorialStepOnVaultStatusChange(
                    vaultWithStatusReady
                );
                dispatch(toggleFirstTimeUser(false));
            } else {
                dispatch(setTutorialStep(TutorialStep.SETUPVAULT));
            }
        } else {
            decideAndDispatchTutorialStepOnVaultStatusChange(
                currentTutorialVault
            );
        }
    }, [
        currentUserAddress,
        currentTutorialVaultUUID,
        currentTutorialVault,
        isSelectWalletModalOpen,
        isDepositModalOpen,
    ]);

    const searchForVaultWithStatus = (status) => {
        return currentVaults.find((vault) => vault.status === status);
    };

    const decideAndDispatchTutorialStepOnVaultStatusChange = (
        currentTutorialVault
    ) => {
        let currentTutorialStep;
        let currentTutorialVaultUUID;

        if (!currentTutorialVault) {
            currentTutorialStep = TutorialStep.SETUPVAULT;
            return;
        }

        switch (currentTutorialVault.status) {
            case vaultStatuses.NONE:
                currentTutorialStep = TutorialStep.WAITFORSETUP;
                break;
            case vaultStatuses.READY:
                currentTutorialVaultUUID = currentTutorialVault.uuid;
                currentTutorialStep = TutorialStep.FUNDVAULT;
                break;
            case vaultStatuses.FUNDED:
                currentTutorialStep = TutorialStep.MINTNFT;
                break;
            case vaultStatuses.PREFUNDED:
                currentTutorialStep = TutorialStep.WAITFORCONFIRMATION;
            case vaultStatuses.NFTISSUED:
                if (currentTutorialVault.isApproved) {
                    currentTutorialStep = TutorialStep.CLOSEVAULT;
                } else {
                    currentTutorialStep = TutorialStep.APPROVENFT;
                }
                break;
            case vaultStatuses.PREREPAID:
                currentTutorialStep = TutorialStep.WAITFORCLOSE;
                break;
            case vaultStatuses.CLOSED:
                currentTutorialStep = TutorialStep.ENDFLOW;
                break;
        }
        dispatch(setTutorialStep(currentTutorialStep));

        if (currentTutorialVaultUUID) {
            dispatch(setTutorialVaultUUID(currentTutorialVaultUUID));
        }
    };
}
