
import eventBus from './EventBus';

export function createAndDispatchAccountInformation(walletType, address, blockchain) {
  const accountInformation = {
    walletType,
    address,
    blockchain,
  };
  eventBus.dispatch('account-information', accountInformation);
}
