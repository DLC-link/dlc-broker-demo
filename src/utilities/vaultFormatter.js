import { customShiftValue } from './formatFunctions';

function formatVault(vaultContract) {
  const rawVaultData = {
    id: parseInt(vaultContract.id._hex),
    uuid: vaultContract.dlcUUID,
    status: vaultContract.status,
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
      vaultCollateral: customShiftValue(rawVaultData.vaultCollateral, 8, true) + ' BTC',
    },
  };
  return vault;
}

export function formatAllVaults(vaults) {
  const formattedVaults = [];
  for (const vault of vaults) {
    const formattedVault = formatVault(vault);
    formattedVaults.push(formattedVault);
  }
  return formattedVaults;
}
