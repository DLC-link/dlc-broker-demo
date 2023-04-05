import { Text, HStack, Tooltip } from '@chakra-ui/react';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PaidIcon from '@mui/icons-material/Paid';
import { InfoOutlined } from '@mui/icons-material';

export default function Status({ status, isCreator }) {
    switch (status) {
        case 'None':
            return (
                <HStack spacing={2}>
                    <CurrencyBitcoinIcon sx={{ color: 'orange' }} />
                    <Text fontSize="12px" color="white">
                        Unfunded
                    </Text>
                </HStack>
            );
        case 'Initialized':
        case 'NotReady':
            return (
                <HStack spacing={2}>
                    <HourglassEmptyIcon sx={{ color: 'orange' }} />
                    <Text fontSize="12px" color="white">
                        Not ready
                    </Text>
                </HStack>
            );
        case 'Ready':
            return (
                <HStack spacing={2}>
                    <CurrencyBitcoinIcon sx={{ color: 'orange' }} />
                    <Text fontSize="12px" color="white">
                        Ready
                    </Text>
                </HStack>
            );
        case 'Funded':
            return (
                <HStack spacing={2}>
                    <CurrencyBitcoinIcon sx={{ color: 'green' }} />
                    <Text fontSize="12px" color="white">
                        Funded
                    </Text>
                </HStack>
            );
        case 'NftIssued':
            return (
                <HStack spacing={!isCreator ? 4 : 2}>
                    <CurrencyBitcoinIcon sx={{ color: 'green' }} />
                    <Text fontSize="12px" color="white">
                        NFT Issued
                    </Text>
                    {!isCreator && (
                        <Tooltip
                            label="This vault was not opened by you. You can redeem the collateral value for WBTC."
                            fontSize={'sm'}
                            padding={2}
                            textAlign={'justify'}
                            borderRadius={'lg'}
                        >
                            <InfoOutlined sx={{ color: '#07E8D8' }} />
                        </Tooltip>
                    )}
                </HStack>
            );
        case 'PreRepaid':
            return (
                <HStack spacing={2}>
                    <HourglassEmptyIcon sx={{ color: 'orange' }} />
                    <Text fontSize="12px" color="white">
                        Waiting to be repaid
                    </Text>
                </HStack>
            );
        case 'Repaid':
            return (
                <HStack spacing={2}>
                    <PaidIcon sx={{ color: 'green' }} />
                    <Text fontSize="12px" color="white">
                        Closed
                    </Text>
                </HStack>
            );
        case 'PreLiquidated':
            return (
                <HStack spacing={2}>
                    <HourglassEmptyIcon sx={{ color: 'orange' }} />
                    <Text fontSize="12px" color="white">
                        Waiting to be liquidated
                    </Text>
                </HStack>
            );
        case 'Liquidated':
            return (
                <HStack spacing={4}>
                    <CurrencyExchangeIcon sx={{ color: 'green' }} />
                    <Text fontSize="12px" color="white">
                        Liquidated
                    </Text>
                    {/* We have to switch the flag here, because ownership has been transferred to the current user during closing */}
                    {!isCreator && (
                        <Tooltip
                            label="This vault was not opened by you. You have redeemed the underlying collateral for WBTC."
                            fontSize={'sm'}
                            padding={2}
                            textAlign={'justify'}
                            borderRadius={'lg'}
                        >
                            <InfoOutlined sx={{ color: '#07E8D8' }} />
                        </Tooltip>
                    )}
                </HStack>
            );
        default:
            <Text>Unknown Status</Text>;
    }
}
