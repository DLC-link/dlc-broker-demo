import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { vaultStatuses } from '../enums/VaultStatuses';

export function useVaults() {
    const vaults = useSelector((state) => state.vaults.vaults);
    const filters = useSelector((state) => state.vaults.filters);
    const stateOrder = ['None', ...Object.values(vaultStatuses)];

    const filterVaults = (vaults, filters) => {
        return vaults.filter((vault) => {
            return (
                (vault.isUserCreated && filters.showMinted) ||
                (!vault.isUserCreated && filters.showReceived)
            );
        });
    };

    const sortLoansByStatus = (vaults, stateOrder) => {
        return vaults.slice().sort((a, b) => {
            const stateAIndex = stateOrder.indexOf(a.status);
            const stateBIndex = stateOrder.indexOf(b.status);
            return stateAIndex - stateBIndex;
        });
    };

    const sortedVaults = useMemo(() => {
        const filteredVaults = filterVaults(vaults, filters);
        return sortLoansByStatus(filteredVaults, stateOrder);
    }, [vaults, filters]);

    return sortedVaults;
}
