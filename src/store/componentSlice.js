import { createSlice } from '@reduxjs/toolkit';

export const componentSlice = createSlice({
    name: 'component',
    initialState: {
        isDepositModalOpen: false,
        isSelectWalletModalOpen: false,
        isInfoModalOpen: false,
    },
    reducers: {
        toggleDepositModalVisibility: (state, action) => {
            state.isDepositModalOpen = action.payload;
        },
        toggleSelectWalletModalVisibility: (state, action) => {
            state.isSelectWalletModalOpen = action.payload;
        },
        toggleInfoModalVisibility: (state, action) => {
            state.isInfoModalOpen = action.payload;
        },
    },
});

export const {
    toggleDepositModalVisibility,
    toggleSelectWalletModalVisibility,
    toggleInfoModalVisibility,
} = componentSlice.actions;

export default componentSlice.reducer;
