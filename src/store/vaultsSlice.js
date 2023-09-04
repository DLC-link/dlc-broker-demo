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
    mintNft,
} from '../blockchainFunctions/ethereumFunctions';
import {
    formatAllVaults,
    formatVault,
    updateVaultToFundingInProgress,
} from '../utilities/vaultFormatter';
import { customShiftValue } from '../utilities/formatFunctions';
import { vaultStatuses } from '../enums/VaultStatuses';
import { ToastEvent } from '../components/CustomToast';

const initialState = {
    vaults: [],
    status: 'idle',
    error: null,
    vaultsWithBTCTransactions: [],
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
                uuid: '-',
                status: vaultStatuses.NONE,
                vaultCollateral: action.payload.vaultContract.BTCDeposit,
                formattedCollateral:
                    customShiftValue(
                        action.payload.vaultContract.BTCDeposit,
                        8,
                        true
                    ) + ' BTC',
                isUserCreated: true,
            };
            state.vaults.unshift(temporaryVault);
            state.toastEvent = {
                txHash: action.payload.txHash,
                status: ToastEvent.SETUPREQUESTED,
            };
        },
        vaultEventReceived: (state, action) => {
            if (action.payload.status === ToastEvent.ACCEPTSUCCEEDED) {
                state.vaultsWithBTCTransactions.push([
                    action.payload.uuid,
                    action.payload.txHash,
                ]);
                fetchVaults();
            }
            state.toastEvent = {
                txHash: action.payload.txHash,
                status: action.payload.status,
                message: action.payload.message,
            };
        },
        deleteToastEvent: (state) => {
            state.toastEvent = null;
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
            .addCase(fetchVault.fulfilled, (state, action) => {
                let vaultIndex;
                if (
                    action.payload.formattedVault.status === vaultStatuses.READY
                ) {
                    vaultIndex = state.vaults.findIndex(
                        (vault) => vault.status === 'None'
                    );
                } else {
                    vaultIndex = state.vaults.findIndex(
                        (vault) =>
                            vault.uuid === action.payload.formattedVault.uuid
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
    deleteToastEvent,
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

export const fetchVaults = createAsyncThunk('vaults/fetchVaults', async () => {
    const { address } = store.getState().account;
    const { vaultsWithBTCTransactions } = store.getState().vaults;

    const { vaults, NFTs } = await fetchVaultsAndNFTs(address);

    const formattedVaults = formatAllVaults(vaults);
    const nftUUIDs = NFTs.map((nft) => nft.dlcUUID);

    const allVaults = [];
    for (let i = 0; i < formattedVaults.length; i++) {
        const vault = formattedVaults[i];

        if (vault.status === vaultStatuses.READY) {
            const matchingVaultWithBTCTransaction =
                vaultsWithBTCTransactions.find(
                    (vaultWithBTCTransaction) =>
                        vault.uuid === vaultWithBTCTransaction[0]
                );
            if (matchingVaultWithBTCTransaction) {
                updateVaultToFundingInProgress(
                    vault,
                    matchingVaultWithBTCTransaction[1]
                );
            }
        }

        if (vault.status === vaultStatuses.FUNDED) {
            await mintNft(vault.uuid);
        }

        if (vault.status === vaultStatuses.NFTISSUED) {
            const nftIndex = nftUUIDs.indexOf(vault.uuid);
            if (nftIndex >= 0) {
                const processedVault = await processNftIssuedVault(
                    vault,
                    NFTs[nftIndex]
                );
                allVaults.push(processedVault);
            } else {
                allVaults.push(vault);
            }
        } else {
            allVaults.push(vault);
        }
    }

    const nftVaults = await getVaultsForNFTs(NFTs, formattedVaults);
    const allVaultsWithNfts = [...allVaults, ...nftVaults];

    return allVaultsWithNfts.map((vault) => {
        vault.isUserCreated = vault.originalCreator === address;
        return vault;
    });
});

export const fetchVault = createAsyncThunk(
    'vaults/fetchVault',
    async (payload) => {
        const { vaultUUID, vaultStatus, vaultTXHash, nftID } = payload;

        const vaultStatusKey = Object.keys(vaultStatuses)[vaultStatus];
        const vaultStatusValue = vaultStatuses[vaultStatusKey];

        const address = store.getState().account.address;

        const { vaults } = store.getState().vaults;

        const storedVaultUUIDs = vaults.map((vault) => vault.uuid);
        const storedNFTIDs = vaults.map((vault) => vault.nftID);

        let fetchedVaultUUIDs = [];

        if (vaultStatusValue === vaultStatuses.READY) {
            const fetchedVaults = await getAllVaultsForAddress();
            fetchedVaultUUIDs = fetchedVaults.map((vault) => vault.uuid);
        }

        if (
            !(
                storedVaultUUIDs.includes(vaultUUID) ||
                fetchedVaultUUIDs.includes(vaultUUID) ||
                storedNFTIDs.includes(nftID)
            )
        ) {
            return;
        } else {
            let vaultUUIDByNFTID;

            if (nftID) {
                vaultUUIDByNFTID = vaults.find(
                    (vault) => vault.nftID === nftID
                ).uuid;
            }

            const vault = await getVaultByUUID(
                nftID ? vaultUUIDByNFTID : vaultUUID
            );

            let formattedVault = formatVault(vault);

            if (vaultStatusValue === vaultStatuses.NFTISSUED) {
                const { NFTs } = await fetchVaultsAndNFTs();

                const NFT = nftID
                    ? NFTs.find((nft) => nft.dlcUUID === vaultUUIDByNFTID)
                    : NFTs.find((nft) => nft.dlcUUID === vaultUUID);

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
