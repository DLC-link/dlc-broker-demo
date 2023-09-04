import { createRoot } from 'react-dom/client';
import persistStore from 'redux-persist/es/persistStore';
import store from './store/store';

import { Provider } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react';
import { PersistGate } from 'redux-persist/integration/react';

import { appTheme } from './styles/appTheme';
import '@fontsource/poppins';

import Observer from './services/Observer';

import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);
let persistor = persistStore(store);
root.render(
    <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
            <Observer />
            <ChakraProvider resetCSS theme={appTheme}>
                <App />
            </ChakraProvider>
        </PersistGate>
    </Provider>
);
