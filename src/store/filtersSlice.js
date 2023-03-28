import { createSlice } from '@reduxjs/toolkit';

export const filtersSlice = createSlice({
    name: 'filters',
    initialState: {
        showMinted: true,
        showReceived: true,
    },
    reducers: {
        setShowMinted: (state, action) => {
            state.showMinted = action.payload;
        },
        setShowReceived: (state, action) => {
            state.showReceived = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { setShowMinted, setShowReceived } = filtersSlice.actions;

export default filtersSlice.reducer;
