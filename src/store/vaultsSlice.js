import {
    createSlice,
    createAsyncThunk,
    createSelector,
} from '@reduxjs/toolkit';
import {
    getAllVaultsForAddress,
    getVaultsForNFTs,
    getAllNFTsForAddress,
} from '../blockchainFunctions/ethereumFunctions';

const initialState = {
    vaults: [],
    status: 'idle',
    error: null,
};

export const vaultsSlice = createSlice({
    name: 'vaults',
    initialState: initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchVaults.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchVaults.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Add any fetched posts to the array
                state.vaults = state.vaults.concat(action.payload);
            })
            .addCase(fetchVaults.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase('account/logout', () => initialState);
    },
});

// Action creators are generated for each case reducer function
// export const { setShowMinted, setShowReceived } = vaultsSlice.actions;

export default vaultsSlice.reducer;

/////////////////////////////////////////////////////
// Selectors

export const selectAllVaults = (state) => state.vaults.vaults;

export const selectTotalRedeemable = createSelector(
    selectAllVaults,
    (vaults) => {
        return vaults
            .filter((vault) => ['Funded', 'NftIssued'].includes(vault.status))
            .map((vault) => vault.vaultCollateral)
            .reduce((acc, curr) => acc + curr, 0);
    }
);

export const selectTotalNFTs = createSelector(selectAllVaults, (vaults) => {
    return vaults.filter((vault) => vault.status === 'NftIssued').length;
});

// TODO: selector ideas:
// - select all vaults that are closed/liquidated

/////////////////////////////////////////////////////
// Data fetching

export const fetchVaults = createAsyncThunk(
    'vaults/fetchVaults',
    async (address) => {
        let NFTs = await getAllNFTsForAddress(address);

        let vaults = await getAllVaultsForAddress(address);
        // Based on dlcUUIds in the NFTs, we have to also get the corresponding vaults
        let nftVaults = await getVaultsForNFTs(NFTs, vaults);
        console.log('NFTs owned without owning vault', nftVaults);

        // if we don't own the underlying NFT, we don't want to show the vault, unless it is closed or before minting
        vaults = vaults.filter(
            (vault) =>
                NFTs.find((nft) => nft.dlcUUID === vault.uuid) ||
                [
                    'NotReady',
                    'Ready',
                    'Funded',
                    'Closed',
                    'Liquidated',
                ].includes(vault.status)
        );

        let allVaults = nftVaults.length ? [...vaults, ...nftVaults] : vaults;
        console.log('All redeemable: ', allVaults);

        // TODO: we could add the extra info in here already, so we could use selectors to get it

        return allVaults;
    }
);
