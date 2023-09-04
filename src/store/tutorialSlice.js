import { createSlice } from '@reduxjs/toolkit';
import { TutorialStep } from '../enums/TutorialSteps';

export const tutorialSlice = createSlice({
    name: 'tutorial',
    initialState: {
        isFirstTimeUser: true,
        tutorialOn: true,
        tutorialStep: TutorialStep.CONNECTWALLET,
        tutorialVaultUUID: '-',
        blurBackground: false,
    },
    reducers: {
        toggleFirstTimeUser: (state, action) => {
            state.isFirstTimeUser = action.payload;
        },
        setTutorialStep: (state, action) => {
            state.tutorialStep = action.payload;
        },
        setTutorialVaultUUID: (state, action) => {
            state.tutorialVaultUUID = action.payload;
        },
        setTutorialOn: (state, action) => {
            state.tutorialOn = action.payload;
        },
    },
});

export const {
    toggleFirstTimeUser,
    setTutorialStep,
    setTutorialVaultUUID,
    setTutorialOn,
} = tutorialSlice.actions;

export default tutorialSlice.reducer;
