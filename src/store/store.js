import { configureStore } from '@reduxjs/toolkit';

import accountReducer from './accountSlice';
import filtersReducer from './filtersSlice';
import vaultsReducer from './vaultsSlice';

export default configureStore({
    reducer: {
        account: accountReducer,
        filters: filtersReducer,
        vaults: vaultsReducer,
    },
});
