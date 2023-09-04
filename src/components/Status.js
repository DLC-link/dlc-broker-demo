import { HStack, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { InfoOutlined } from '@mui/icons-material';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PaidIcon from '@mui/icons-material/Paid';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { vaultStatuses } from '../enums/VaultStatuses';
import { useOnMount } from '../hooks/useOnMount';

export default function Status({ status, isCreator, txHash }) {
    const { blockchain } = useSelector((state) => state.account);
    const [text, setText] = useState();
    const [icon, setIcon] = useState();

    const bitcoinNetwork =
        blockchain === 'stacks:1' || blockchain === 'ethereum:1'
            ? 'mainnet'
            : 'testnet';

    const bitcoinExplorerURL = `https://mempool.space/${
        bitcoinNetwork !== 'mainnet' ? bitcoinNetwork + '/' : ''
    }tx/${txHash}`;

    const OpenExplorerLink = () => {
        window.open(bitcoinExplorerURL, '_blank');
    };

    const StatusInfo = ({ children, text }) => {
        return (
            <HStack>
                {children}
                <Text fontWeight={'extrabold'} color="white" fontSize={12}>
                    {text}
                </Text>
            </HStack>
        );
    };

    const LiquidatedInfoIcon = () => {
        return (
            <Tooltip
                label="This vault was not opened by you. You can redeem the collateral value for WBTC."
                fontSize={'sm'}
                padding={2}
                textAlign={'justify'}
                borderRadius={'lg'}
            >
                <InfoOutlined sx={{ color: '#07E8D8' }} />
            </Tooltip>
        );
    };

    const NFTIssuedInfoIcon = () => {
        return (
            <Tooltip
                label="This vault was not opened by you. You can redeem the collateral value for WBTC."
                fontSize={'10px'}
                textAlign={'justify'}
                padding={2.5}
                placement={'bottom'}
                width={200}
                background={'transparent'}
                border={'1px solid #FF4500'}
                borderRadius={'lg'}
                shadow={'dark-lg'}
                gutter={35}
            >
                <InfoOutlined sx={{ color: '#07E8D8' }} />
            </Tooltip>
        );
    };

    useOnMount(() => {
        switch (status) {
            case vaultStatuses.NONE:
                setIcon(
                    <HourglassEmptyIcon
                        sx={{ color: '#FF4500', height: '20px' }}
                    />
                );
                setText('Not ready');
                break;
            case vaultStatuses.PREREPAID:
                setIcon(
                    <HourglassEmptyIcon
                        sx={{ color: '#04BAB2', height: '20px' }}
                    />
                );
                setText('Repayment pending');
                break;
            case vaultStatuses.READY:
                setIcon(
                    <CurrencyBitcoinIcon
                        sx={{ color: '#04BAB2', height: '20px' }}
                    />
                );
                setText('Ready');
                break;
            case vaultStatuses.PREFUNDED:
                setIcon(
                    <HourglassEmptyIcon
                        sx={{ color: '#04BAB2', height: '20px' }}
                    />
                );
                setText('Funding pending');
                break;
            case vaultStatuses.FUNDED:
                setIcon(
                    <CurrencyBitcoinIcon
                        sx={{ color: '#04BAB2', height: '20px' }}
                    />
                );
                setText('Funded');
                break;
            case vaultStatuses.NFTISSUED:
                setIcon(
                    <CurrencyBitcoinIcon
                        sx={{ color: '#04BAB2', height: '20px' }}
                    />
                );
                setText('NFT Issued');
                break;
            case vaultStatuses.LIQUIDATED:
                setIcon(
                    <CurrencyExchangeIcon
                        sx={{ color: '#04BAB2', height: '20px' }}
                    />
                );
                setText('Liquidated');
                break;
            case vaultStatuses.REPAID:
                setIcon(<PaidIcon sx={{ color: '#04BAB2', height: '20px' }} />);
                setText('Closed');
                break;
            default:
                break;
        }
    });

    return (
        <HStack
            width={215}
            paddingTop={2.5}
            paddingBottom={2.5}
            justifyContent={'space-between'}
        >
            <StatusInfo text={text}>{icon}</StatusInfo>
            {!isCreator && status === vaultStatuses.LIQUIDATED && (
                <LiquidatedInfoIcon />
            )}
            {!isCreator && status === vaultStatuses.NFTISSUED && (
                <NFTIssuedInfoIcon />
            )}
            {status === vaultStatuses.PREFUNDED && (
                <Tooltip
                    label="View transaction in explorer"
                    fontSize={'sm'}
                    placement={'top-end'}
                >
                    <IconButton
                        icon={<InfoOutlined />}
                        variant={'ghost'}
                        boxSize={5}
                        color="#07E8D8"
                        _hover={{ background: 'transparent' }}
                        onClick={() => OpenExplorerLink()}
                    />
                </Tooltip>
            )}
        </HStack>
    );
}
