import { customShiftValue } from './formatFunctions';

export function countCollateralToDebtRatio(collateralAmount, bitcoinValue, vaultLoan, additionalLoan) {
  const collateralInUSD = Math.round(collateralAmount * bitcoinValue);
  const collateralToDebtRatio =
    Number(collateralInUSD) / (Number(customShiftValue(vaultLoan, 6, true)) + Number(additionalLoan));
  return Math.round(collateralToDebtRatio * 100);
}

export function countdown(seconds) {
  let interval = setInterval(() => {
    if (seconds % 5 === 0) {
      console.log(`%c${seconds}`, 'color: turquoise');
    }
    seconds--;
    if (seconds < 0) {
      clearInterval(interval);
    }
  }, 1000);
}
