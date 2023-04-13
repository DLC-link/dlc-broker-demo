import {
    createSlice,
    createAsyncThunk,
    createSelector,
} from '@reduxjs/toolkit';
import store from './store';
import {
    getVaultsForNFTs,
    fetchVaultsAndNFTs,
    processNftIssuedVault,
} from '../blockchainFunctions/ethereumFunctions';
import { formatAllVaults } from '../utilities/vaultFormatter';
import { customShiftValue } from '../utilities/formatFunctions';

const initialState = {
    vaults: [],
    status: 'idle',
    error: null,
    filters: {
        showMinted: true,
        showReceived: true,
    },
};

export const vaultsSlice = createSlice({
    name: 'vaults',
    initialState: initialState,
    reducers: {
        mintedFilterChanged: (state, action) => {
            state.filters.showMinted = action.payload;
        },
        receivedFilterChanged: (state, action) => {
            state.filters.showReceived = action.payload;
        },
        vaultSetupRequested: (state, action) => {
            const tempVault = {
                uuid: '',
                status: 'Initialized',
                vaultCollateral: action.payload.BTCDeposit,
                formattedCollateral:
                    customShiftValue(action.payload.BTCDeposit, 8, true) +
                    ' BTC',
                isUserCreated: true,
            };
            state.vaults.unshift(tempVault);
        },
        vaultStatusChanged: (state, action) => {
            // TODO: this is not working currently
            // const { vaultUUID, vaultStatus } = action.payload;
            // console.log('vaultStatusChanged', vaultUUID, vaultStatus);
            // if (vaultStatus === 'NotReady') {
            //     // we get an update on a new vault
            //     const tempVault = state.vaults.find(
            //         (v) => v.status === 'Initialized'
            //     );
            //     if (tempVault) {
            //         tempVault.status = 'NotReady';
            //         tempVault.uuid = vaultUUID;
            //     }
            //     return;
            // }
            // const existingVault = state.vaults.find(
            //     (vault) => vault.uuid === vaultUUID
            // );
            // if (existingVault) {
            //     existingVault.status = vaultStatus;
            // }
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchVaults.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchVaults.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
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
export const {
    mintedFilterChanged,
    receivedFilterChanged,
    vaultSetupRequested,
    vaultStatusChanged,
} = vaultsSlice.actions;

export default vaultsSlice.reducer;

/////////////////////////////////////////////////////
// Selectors

export const selectAllVaults = (state) => {
    return state.vaults.vaults.slice().sort((a, b) => b.id - a.id);
};

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

export const selectFilters = (state) => state.vaults.filters;

export const selectFilteredVaults = createSelector(
    selectAllVaults,
    selectFilters,
    (vaults, filters) => {
        return vaults.filter((vault) => {
            return (
                (vault.isUserCreated && filters.showMinted) ||
                (!vault.isUserCreated && filters.showReceived)
            );
        });
    }
);

/////////////////////////////////////////////////////
// Data fetching

export const fetchVaults = createAsyncThunk(
    'vaults/fetchVaults',
    async (address) => {
        console.log(address)
        const { vaults, NFTs } = await fetchVaultsAndNFTs(address);
        const formattedVaults = formatAllVaults(vaults);
        const nftUuids = NFTs.map((nft) => nft.dlcUUID);

        let allVaults = [];

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

        const userAddress = store.getState().account.address;
        console.log(allVaults)
        allVaults = allVaults.map((vault) => {
            vault.isUserCreated = vault.originalCreator === userAddress;
            return vault;
        });
        return allVaults;
    }
);
