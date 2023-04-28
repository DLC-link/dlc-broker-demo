import { configureStore } from '@reduxjs/toolkit';

import accountReducer from './accountSlice';
import vaultsReducer from './vaultsSlice';
import componentReducer from './componentSlice';

export default configureStore({
    reducer: {
        account: accountReducer,
        vaults: vaultsReducer,
        component: componentReducer,
    },
});
