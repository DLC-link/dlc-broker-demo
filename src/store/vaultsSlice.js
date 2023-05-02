import {
    createSlice,
    createAsyncThunk,
    createSelector,
} from '@reduxjs/toolkit';
import store from './store';
import {
    getVaultsForNFTs,
    getVaultByUUID,
    getAllVaultsForAddress,
    fetchVaultsAndNFTs,
    processNftIssuedVault,
} from '../blockchainFunctions/ethereumFunctions';
import { formatAllVaults, formatVault } from '../utilities/vaultFormatter';
import { customShiftValue } from '../utilities/formatFunctions';
import { vaultStatuses } from '../enums/VaultStatuses';

const initialState = {
    vaults: [],
    status: 'idle',
    error: null,
    filters: {
        showMinted: true,
        showReceived: true,
    },
    toastEvent: null,
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
            const temporaryVault = {
                uuid: '',
                status: 'Initialized',
                vaultCollateral: action.payload.BTCDeposit,
                formattedCollateral:
                    customShiftValue(action.payload.BTCDeposit, 8, true) +
                    ' BTC',
                isUserCreated: true,
            };
            state.vaults.unshift(temporaryVault);
            state.toastEvent = {
                txHash: null,
                status: temporaryVault.status,
            };
        },
        vaultEventReceived: (state, action) => {
            state.toastEvent = {
                txHash: action.payload.vaultTXHash,
                status: action.payload.status,
            };
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
            .addCase(fetchVault.pending, (state, action) => {
                state.status = 'loading';
            })
        .addCase(fetchVault.fulfilled, (state, action) => {
                let vaultIndex;
                if (
                    action.payload.formattedVault.status ===
                    vaultStatuses.NOTREADY
                ) {
                    console.log('Inside fetchVault.fulfilled - NOTREADY');
                    vaultIndex = state.vaults.findIndex(
                        (vault) => vault.status === 'Initialized'
                    );
                } else {
                    console.log('Inside fetchVault.fulfilled');
                    vaultIndex = state.vaults.findIndex(
                        (vault) => vault.uuid === action.payload.formattedVault.uuid
                    );
                }
                state.vaults[vaultIndex] = action.payload.formattedVault;

                state.toastEvent = {
                    txHash: action.payload.vaultTXHash,
                    status: action.payload.formattedVault.status,
                };

                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchVault.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase('account/logout', () => initialState);
    },
});

export const {
    mintedFilterChanged,
    receivedFilterChanged,
    vaultSetupRequested,
    vaultStatusChanged,
    vaultEventReceived,
} = vaultsSlice.actions;

export default vaultsSlice.reducer;

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

export const fetchVaults = createAsyncThunk('vaults/fetchVaults', async () => {
    const address = store.getState().account.address;

    const { vaults, NFTs } = await fetchVaultsAndNFTs(address);
    const formattedVaults = formatAllVaults(vaults);
    const nftUUIDs = NFTs.map((nft) => nft.dlcUUID);

    let allVaults = [];

    for (const vault of formattedVaults) {
        const nftIndex = nftUUIDs.indexOf(vault.uuid);
        // if we don't own the underlying NFT, we don't want to show the vault, unless it is closed or before minting

        if (vault.status === vaultStatuses.NFTISSUED) {
            if (nftIndex >= 0) {
                const processedVault = await processNftIssuedVault(
                    vault,
                    NFTs[nftIndex]
                );
                allVaults.push(processedVault);
            }
        } else {
            allVaults.push(vault);
        }
    }

    const nftVaults = await getVaultsForNFTs(NFTs, formattedVaults);

    allVaults.push(...nftVaults);

    allVaults = allVaults.map((vault) => {
        vault.isUserCreated = vault.originalCreator === address;
        return vault;
    });

    return allVaults;
});

export const fetchVault = createAsyncThunk(
    'vaults/fetchVault',
    async (payload) => {
        console.log('Inside fetchVault');

        const vaultUUID = payload.vaultUUID;
        const vaultStatus = payload.vaultStatus;
        const vaultTXHash = payload.vaultTXHash;

        const vaultStatusKey = Object.keys(vaultStatuses)[vaultStatus];
        const vaultStatusValue = vaultStatuses[vaultStatusKey];

        const address = store.getState().account.address;

        const { vaults } = store.getState().vaults;

        const storedVaultUUIDs = vaults.map((vault) => vault.uuid);
        let fetchedVaultUUIDs = [];

        if (vaultStatusValue === vaultStatuses.NOTREADY) {
            console.log('Inside fetchVault - NOTREADY');
            const fetchedVaults = await getAllVaultsForAddress();
            fetchedVaultUUIDs = fetchedVaults.map((vault) => vault.uuid);
        }

        if (
            !(
                storedVaultUUIDs.includes(vaultUUID) ||
                fetchedVaultUUIDs.includes(vaultUUID)
            )
        ) {
            console.log('Inside fetchVault - vault not found');
            return;
        } else {
            const vault = await getVaultByUUID(vaultUUID);
            console.log('Inside fetchVault - vault found');
            console.log(vault)
            let formattedVault = formatVault(vault);

            if (vaultStatus === vaultStatuses.NFTISSUED) {
                console.log('Inside fetchVault - NFTISSUED')
                const { NFTs } = await fetchVaultsAndNFTs();
                const NFT = NFTs.find((nft) => nft.dlcUUID === vaultUUID);
                formattedVault = await processNftIssuedVault(
                    formattedVault,
                    NFT
                );
            }

            formattedVault.isUserCreated =
                formattedVault.originalCreator === address;

            return { formattedVault, vaultTXHash };
        }
    }
);
