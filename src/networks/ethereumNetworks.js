export const EthereumNetworks = {
    5: {
        dlcBrokerAddress: process.env.REACT_APP_GOERLI_DLC_BROKER_ADDRESS,
        btcNftAddress: process.env.REACT_APP_GOERLI_BTC_NFT_ADDRESS,
        dlcManagerAddress: process.env.REACT_APP_GOERLI_DLC_MANAGER_ADDRESS,
    },
    11155111: {
        dlcBrokerAddress: process.env.REACT_APP_SEPOLIA_DLC_BROKER_ADDRESS,
        btcNftAddress: process.env.REACT_APP_SEPOLIA_BTC_NFT_ADDRESS,
        dlcManagerAddress: process.env.REACT_APP_SEPOLIA_DLC_MANAGER_ADDRESS,
    },
};
