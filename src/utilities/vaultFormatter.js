import { customShiftValue } from '../utilities/formatFunctions';
import { vaultStatuses } from '../enums/VaultStatuses';

function formatVault(vaultContract) {
    const statusLookup = Object.values(vaultStatuses);
    const collateralValue = parseInt(vaultContract.vaultCollateral._hex);
    return {
        id: parseInt(vaultContract.id._hex),
        uuid: vaultContract.dlcUUID,
        status: statusLookup[vaultContract.status],
        vaultCollateral: collateralValue,
        formattedCollateral:
            customShiftValue(collateralValue, 8, true) + ' BTC',
        nftID: parseInt(vaultContract.nftId._hex),
        owner: vaultContract.owner.toLowerCase(),
        nftImageURL: undefined,
    };
}

export function formatAllVaults(vaults) {
    return vaults.map(formatVault);
}
