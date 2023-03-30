import { configureStore } from '@reduxjs/toolkit';

import accountReducer from './accountSlice';
import vaultsReducer from './vaultsSlice';

export default configureStore({
    reducer: {
        account: accountReducer,
        vaults: vaultsReducer,
    },
});
