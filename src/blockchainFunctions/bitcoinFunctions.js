/*global chrome*/

const sendOfferForSigning = async (offer) => {
  console.log('Offer: ', offer);
  const extensionIDs = [
    'nminefocgojkadkocbddiddjmoooonhe',
    'gjjgfnpmfpealbpggmhfafcddjiopbpa',
    'kmidoigmjbbecngmenanflcogbjojlhf',
    'niinmdkjgghdkkmlilpngkccihjmefin',
    'bdadpbnmclplacnjpjoigpmbcinccnep',
    'pijajlnoadmfancnckejodabelilkcoa', // Niel's
  ];

  for (let i = 0; i < extensionIDs.length; i++) {
    chrome.runtime.sendMessage(
      extensionIDs[i],
      {
        action: 'get-offer',
        data: { offer: offer },
      },
      {},
      function () {
        if (chrome.runtime.lastError) {
          console.log('Failure: ' + chrome.runtime.lastError.message);
        } else {
          console.log('Success: Found receiving end.');
        }
      }
    );
  }
};

export const lockBTC = async (vaultContract) => {
  const URL = process.env.REACT_APP_WALLET_DOMAIN + `/offer`;
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uuid: vaultContract.raw.uuid,
        acceptCollateral: parseInt(vaultContract.raw.vaultCollateral),
        offerCollateral: 1000,
        totalOutcomes: 100,
      }),
    });
    const responseStream = await response.json();
    if (!response.ok) {
      console.error(responseStream.errors[0].message);
    }
    sendOfferForSigning(responseStream);
  } catch (error) {
    console.error(error);
  }
};

export const fetchBitcoinPrice = async () => {
  let bitCoinValue = undefined;
  try {
    await fetch('https://api.coindesk.com/v1/bpi/currentprice.json', {
      headers: { Accept: 'application/json' },
    })
      .then((response) => response.json())
      .then((message) => (bitCoinValue = Number(message.bpi.USD.rate.replace(/[^0-9.-]+/g, ''))));
  } catch (error) {
    console.error(error);
  }
  return bitCoinValue;
};
