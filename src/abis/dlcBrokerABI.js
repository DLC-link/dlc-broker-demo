export const abi = [
    'constructor(address _dlcManagerAddress, address _dlcNftAddress)',
    'event BurnBtcNft(bytes32 dlcUUID, uint256 nftId)',
    'event MintBtcNft(bytes32 dlcUUID, uint256 btcDeposit)',
    'event SetupVault(bytes32 dlcUUID, uint256 btcDeposit, uint256 emergencyRefundTime, uint256 index, address owner)',
    'event StatusUpdate(uint256 vaultid, bytes32 dlcUUID, uint8 newStatus)',
    'function closeVault(uint256 _vaultID)',
    'function getAllVaultsForAddress(address _addy) view returns (tuple(uint256 id, bytes32 dlcUUID, uint8 status, uint256 vaultCollateral, uint256 nftId, address owner)[])',
    'function getBtcPriceCallback(bytes32 uuid, int256 price, uint256 timestamp)',
    'function getVault(uint256 _vaultID) view returns (tuple(uint256 id, bytes32 dlcUUID, uint8 status, uint256 vaultCollateral, uint256 nftId, address owner))',
    'function getVaultByUUID(bytes32 _uuid) view returns (tuple(uint256 id, bytes32 dlcUUID, uint8 status, uint256 vaultCollateral, uint256 nftId, address owner))',
    'function index() view returns (uint256)',
    'function postCloseDLCHandler(bytes32 _uuid)',
    'function postCreateDLCHandler(bytes32 _uuid)',
    'function postMintBtcNft(bytes32 _uuid, uint256 _nftId)',
    'function setStatusFunded(bytes32 _uuid)',
    'function setupVault(uint256 btcDeposit, uint256 emergencyRefundTime) returns (uint256)',
    'function vaultIDsByUUID(bytes32) view returns (uint256)',
    'function vaults(uint256) view returns (uint256 id, bytes32 dlcUUID, uint8 status, uint256 vaultCollateral, uint256 nftId, address owner)',
    'function vaultsPerAddress(address) view returns (uint256)',
];
