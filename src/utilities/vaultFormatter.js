import { customShiftValue } from '../utilities/formatFunctions';
import { vaultStatuses } from '../enums/VaultStatuses';

export function formatVault(vaultContract) {
    const statusLookup = Object.values(vaultStatuses);
    return {
        id: parseInt(vaultContract.id._hex),
        uuid: vaultContract.dlcUUID,
        status: statusLookup[vaultContract.status],
        vaultCollateral: parseInt(vaultContract.vaultCollateral._hex),
        formattedCollateral:
            customShiftValue(
                parseInt(vaultContract.vaultCollateral._hex),
                8,
                true
            ) + ' BTC',
        nftID: parseInt(vaultContract.nftId._hex),
        owner: vaultContract.owner.toLowerCase(),
        originalCreator: vaultContract.originalCreator.toLowerCase(),
        nftImageURL: undefined,
        attestorList: vaultContract.attestorList,
        txHash: '',
    };
}

export function formatAllVaults(vaults) {
    return vaults.map(formatVault);
}

export function updateVaultToFundingInProgress(vault, vaultTXHash) {
    vault.txHash = vaultTXHash;
    vault.status = vaultStatuses.PREFUNDED;
}
