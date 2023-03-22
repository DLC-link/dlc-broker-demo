import React, { useEffect, useState } from 'react';
import { Text, Collapse, VStack, IconButton, HStack } from '@chakra-ui/react';
import VaultsGrid from './VaultsGrid';
import Balance from './Balance';
import eventBus from '../utilities/eventBus';
import {
    getAllNFTsForAddress,
    getAllVaultsForAddress,
} from '../blockchainFunctions/ethereumFunctions';
import { fetchBitcoinPrice } from '../blockchainFunctions/bitcoinFunctions';
import { RefreshOutlined } from '@mui/icons-material';

export default function VaultsPage({
    isConnected,
    isProviderSet,
    address,
    walletType,
    blockchain,
    depositAmount,
    nftQuantity,
}) {
    const [bitcoinValue, setBitcoinValue] = useState(0);
    const [isLoading, setLoading] = useState([false, false]);
    const [initialVaults, setInitialVaults] = useState([]);
    const [vaults, setVaults] = useState([]);
    const [NFTs, setNFTs] = useState([]);

    useEffect(() => {
        if (isProviderSet === true) {
            refreshVaultsTable();
        }

        const handleVaultEvent = (event) => {
            switch (event.status) {
                case 'NotReady':
                    initialVaults.shift();
                    break;
                case 'Initialized':
                    initialVaults.push(event.vaultContract);
                    break;
                default:
                    break;
            }
            if (isProviderSet === true) {
                refreshVaultsTable();
            }
        };

        const fetchData = async () => {
            try {
                const bitcoinPrice = await fetchBitcoinPrice();
                setBitcoinValue(bitcoinPrice);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
        eventBus.on('vault-event', handleVaultEvent);
    }, [isProviderSet]);

    const fetchAllVaultsAndNFTs = async () => {
        let vaults = [];
        let NFTs = [];
        switch (walletType) {
            case 'metamask':
                vaults = await getAllVaultsForAddress(address);
                NFTs = await getAllNFTsForAddress(address);
                break;
            default:
                console.error('Unsupported wallet type!');
                break;
        }
        eventBus.dispatch('vaults', vaults);
        const sortStatusOrder = [
            'None',
            'NftIssued',
            'Funded',
            'Ready',
            'NotReady',
            'PreRepaid',
            'PreLiquidated',
            'Repaid',
            'Liquidated',
        ];
        const sortedVaults = vaults.sort(
            (a, b) =>
                sortStatusOrder.indexOf(a.raw.status) -
                sortStatusOrder.indexOf(b.raw.status)
        );
        return { sortedVaults, NFTs };
    };

    const countBalance = (vaults) => {
        function sumDepositAmount(vaults) {
            return vaults
                .filter((vault) =>
                    ['Funded', 'NftIssued'].includes(vault.raw.status)
                )
                .map((vault) => vault.raw.vaultCollateral)
                .reduce((acc, curr) => acc + curr, 0);
        }

        function countNFTQuantity(vaults) {
            return vaults.filter((vault) => vault.raw.status === 'NftIssued')
                .length;
        }

        const depositAmount = sumDepositAmount(vaults);
        const nftQuantity = countNFTQuantity(vaults);

        eventBus.dispatch('change-deposit-amount', {
            depositAmount: depositAmount,
        });
        eventBus.dispatch('change-nft-quantity', {
            nftQuantity: nftQuantity,
        });
    };

    const refreshVaultsTable = async (isManual) => {
        setLoading([true, isManual]);
        fetchAllVaultsAndNFTs()
            .then(({ sortedVaults, NFTs }) => {
                setVaults(sortedVaults);
                setNFTs(NFTs);
                countBalance(sortedVaults);
            })
            .then(() => {
                setLoading(false, false);
            });
    };

    return (
        <>
            <Collapse in={isConnected}>
                <VStack marginBottom="50px">
                    <HStack justifyContent="center">
                        <IconButton
                            _hover={{
                                borderColor: 'accent',
                                color: 'accent',
                                transform: 'translateY(-2.5px)',
                            }}
                            variant="outline"
                            isLoading={isLoading[0] && isLoading[1]}
                            marginLeft="0px"
                            height="35px"
                            width="35px"
                            borderRadius="lg"
                            borderColor="white"
                            color="white"
                            icon={
                                <RefreshOutlined color="inherit"></RefreshOutlined>
                            }
                            onClick={() => refreshVaultsTable(true)}
                        ></IconButton>
                        <Text fontSize="3xl" fontWeight="extrabold">
                            BITCOIN VAULTS
                        </Text>
                    </HStack>
                    <Balance
                        isConnected={isConnected}
                        depositAmount={depositAmount}
                        nftQuantity={nftQuantity}
                    ></Balance>
                </VStack>
                <VaultsGrid
                    isLoading={isLoading[0]}
                    isConnected={isConnected}
                    walletType={walletType}
                    address={address}
                    blockchain={blockchain}
                    initialVaults={initialVaults}
                    vaults={vaults}
                    NFTs={NFTs}
                    bitcoinValue={bitcoinValue}
                ></VaultsGrid>
            </Collapse>
        </>
    );
}
