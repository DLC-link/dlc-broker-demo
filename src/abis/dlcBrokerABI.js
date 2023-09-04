export const abi = [
    'constructor(address _dlcManagerAddress, address _dlcNftAddress, address _dlcBTCAddress, address _protocolWallet)',
    'event BurnBtcNft(bytes32 dlcUUID, uint256 nftId)',
    'event MintBtcNft(bytes32 dlcUUID, uint256 nftId)',
    'event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole)',
    'event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)',
    'event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)',
    'event SetupVault(bytes32 dlcUUID, uint256 btcDeposit, uint256 index, string[] attestorList, address owner)',
    'event StatusUpdate(uint256 vaultid, bytes32 dlcUUID, uint8 newStatus)',
    'function ADMIN_ROLE() view returns (bytes32)',
    'function DEFAULT_ADMIN_ROLE() view returns (bytes32)',
    'function DLC_MANAGER_ROLE() view returns (bytes32)',
    'function closeVault(uint256 _vaultID)',
    'function getAllVaultsForAddress(address _addy) view returns (tuple(uint256 id, bytes32 dlcUUID, string[] attestorList, uint8 status, uint256 vaultCollateral, uint256 nftId, address owner, address originalCreator)[])',
    'function getRoleAdmin(bytes32 role) view returns (bytes32)',
    'function getVault(uint256 _vaultID) view returns (tuple(uint256 id, bytes32 dlcUUID, string[] attestorList, uint8 status, uint256 vaultCollateral, uint256 nftId, address owner, address originalCreator))',
    'function getVaultByUUID(bytes32 _uuid) view returns (tuple(uint256 id, bytes32 dlcUUID, string[] attestorList, uint8 status, uint256 vaultCollateral, uint256 nftId, address owner, address originalCreator))',
    'function grantRole(bytes32 role, address account)',
    'function hasRole(bytes32 role, address account) view returns (bool)',
    'function index() view returns (uint256)',
    'function mintBtcNft(bytes32 _uuid, string _uri)',
    'function postCloseDLCHandler(bytes32 _uuid)',
    'function renounceRole(bytes32 role, address account)',
    'function revokeRole(bytes32 role, address account)',
    'function setProtocolWallet(address _protocolWallet)',
    'function setStatusFunded(bytes32 _uuid)',
    'function setupVault(uint256 btcDeposit, uint8 attestorCount) returns (uint256)',
    'function supportsInterface(bytes4 interfaceId) view returns (bool)',
    'function vaultIDsByUUID(bytes32) view returns (uint256)',
    'function vaults(uint256) view returns (uint256 id, bytes32 dlcUUID, uint8 status, uint256 vaultCollateral, uint256 nftId, address owner, address originalCreator)',
    'function vaultsPerAddress(address) view returns (uint256)',
];
