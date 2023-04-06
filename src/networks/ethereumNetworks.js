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
    31337: {
        dlcBrokerAddress: '0xa513e6e4b8f2a923d98304ec87f64353c4d5c853',
        btcNftAddress: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
        dlcManagerAddress: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
    },
};
