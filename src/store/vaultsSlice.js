import {
    createSlice,
    createAsyncThunk,
    createSelector,
} from '@reduxjs/toolkit';
import {
    getVaultsForNFTs,
    fetchVaultsAndNFTs,
    processNftIssuedVault,
} from '../blockchainFunctions/ethereumFunctions';
import { formatAllVaults } from '../utilities/vaultFormatter';

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
                state.vaults = action.payload;
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

export const selectVaultByUUID = (state, uuid) => {
    return state.vaults.vaults.find((vault) => vault.uuid === uuid);
};

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
        const { vaults, NFTs } = await fetchVaultsAndNFTs(address);

        const formattedVaults = formatAllVaults(vaults);
        const nftUuids = NFTs.map((nft) => nft.dlcUUID);

        const allVaults = [];

        for (const vault of formattedVaults) {
            const nftIndex = nftUuids.indexOf(vault.uuid);
            // if we don't own the underlying NFT, we don't want to show the vault, unless it is closed or before minting
            if (
                nftIndex >= 0 ||
                [
                    'NotReady',
                    'Ready',
                    'Funded',
                    'Closed',
                    'Liquidated',
                ].includes(vault.status)
            ) {
                const processedVault = await processNftIssuedVault(
                    vault,
                    nftIndex >= 0 ? NFTs[nftIndex] : null
                );
                allVaults.push(processedVault);
            }
        }

        const nftVaults = await getVaultsForNFTs(NFTs, formattedVaults);

        allVaults.push(...nftVaults);

        return allVaults;
    }
);
