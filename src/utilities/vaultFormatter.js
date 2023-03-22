import { customShiftValue } from '../utilities/formatFunctions';
import { vaultStatuses } from '../enums/VaultStatuses';

function formatVault(vaultContract) {
    const statusLookup = Object.values(vaultStatuses);
    const rawVaultData = {
        id: parseInt(vaultContract.id._hex),
        uuid: vaultContract.dlcUUID,
        status: statusLookup[vaultContract.status],
        vaultCollateral: parseInt(vaultContract.vaultCollateral._hex),
        nftID: parseInt(vaultContract.nftId._hex),
        owner: vaultContract.owner,
        nftImageURL: undefined,
    };
    return createVaultObject(rawVaultData);
}

function createVaultObject(rawVaultData) {
    const vault = {
        raw: rawVaultData,
        formatted: {
            vaultCollateral:
                customShiftValue(rawVaultData.vaultCollateral, 8, true) +
                ' BTC',
        },
    };
    return vault;
}

export function formatAllVaults(vaults) {
    return vaults.map(formatVault);
}
