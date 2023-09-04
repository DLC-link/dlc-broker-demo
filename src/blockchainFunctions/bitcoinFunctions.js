/*global chrome*/

import store from '../store/store';
import { ToastEvent } from '../components/CustomToast';
import { vaultEventReceived } from '../store/vaultsSlice';
import { fetchVaults } from '../store/vaultsSlice';

const createURLParams = (bitcoinContractOffer, attestorURLs) => {
    const counterPartyWalletDetails = {
        counterpartyWalletURL: process.env.REACT_APP_WALLET_DOMAIN,
        counterpartyWalletName: 'DLC.Link',
        counterpartyWalletIcon:
            'https://dlc-public-assets.s3.amazonaws.com/DLC.Link_logo_icon_color.svg',
    };
    const urlParams = {
        bitcoinContractOffer: JSON.stringify(bitcoinContractOffer),
        attestorURLs: JSON.stringify(attestorURLs),
        counterpartyWalletDetails: JSON.stringify(counterPartyWalletDetails),
    };

    return urlParams;
};

const sendOfferForSigning = async (urlParams, vaultUUID) => {
    window.btc
        .request('acceptBitcoinContractOffer', urlParams)
        .then((response) => {
            store.dispatch(
                vaultEventReceived({
                    status: ToastEvent.ACCEPTSUCCEEDED,
                    txHash: response.result.txId,
                    uuid: vaultUUID,
                })
            );
            store.dispatch(fetchVaults());
        })
        .catch((error) => {
            store.dispatch(
                vaultEventReceived({
                    status: ToastEvent.ACCEPTFAILED,
                    message: error.error.message,
                })
            );
        });
};

export const fetchBitcoinContractOfferFromCounterpartyWallet = async (
    vaultContract
) => {
    const { blockchain } = store.getState().account;
    const URL =
        blockchain === 31337
            ? process.env.REACT_APP_DEVNET_WALLET_DOMAIN + `/offer`
            : process.env.REACT_APP_TESTNET_WALLET_DOMAIN + `/offer`;

    const attestorListJSON = JSON.stringify(vaultContract.attestorList);
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uuid: vaultContract.uuid,
                acceptCollateral: parseInt(vaultContract.vaultCollateral),
                offerCollateral: 0,
                totalOutcomes: 100,
                attestorList: attestorListJSON,
            }),
        });
        const responseStream = await response.json();
        if (!response.ok) {
            throw new Error(responseStream.errors[0].message);
        }
        return responseStream;
    } catch (error) {
        store.dispatch(
            vaultEventReceived({
                status: ToastEvent.FETCHFAILED,
                message: error.message,
            })
        );
    }
};

export const fetchBitcoinPrice = async () => {
    let bitCoinValue = undefined;
    try {
        await fetch('https://api.coindesk.com/v1/bpi/currentprice.json', {
            headers: { Accept: 'application/json' },
        })
            .then((response) => response.json())
            .then(
                (message) =>
                    (bitCoinValue = Number(
                        message.bpi.USD.rate.replace(/[^0-9.-]+/g, '')
                    ))
            );
    } catch (error) {
        console.error(error);
    }
    return bitCoinValue;
};

export const fetchBitcoinContractOfferAndSendToUserWallet = async (
    vaultContract
) => {
    const bitcoinContractOffer =
        await fetchBitcoinContractOfferFromCounterpartyWallet(vaultContract);
    if (!bitcoinContractOffer) return;
    const urlParams = createURLParams(
        bitcoinContractOffer,
        vaultContract.attestorList
    );
    sendOfferForSigning(urlParams, vaultContract.uuid);
};
