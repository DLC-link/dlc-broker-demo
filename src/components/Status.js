import { Text, HStack } from '@chakra-ui/react';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PaidIcon from '@mui/icons-material/Paid';

export default function Status({ status }) {
  switch (status) {
    case 'None':
      return (
        <HStack spacing={2}>
          <CurrencyBitcoinIcon sx={{ color: 'orange' }} />
          <Text
            fontSize='12px'
            color='white'>
            Unfunded
          </Text>
        </HStack>
      );
    case 'NotReady':
      return (
        <HStack spacing={2}>
          <HourglassEmptyIcon sx={{ color: 'orange' }} />
          <Text
            fontSize='12px'
            color='white'>
            Not ready
          </Text>
        </HStack>
      );
    case 'Ready':
      return (
        <HStack spacing={2}>
          <CurrencyBitcoinIcon sx={{ color: 'orange' }} />
          <Text
            fontSize='12px'
            color='white'>
            Ready
          </Text>
        </HStack>
      );
    case 'Funded':
      return (
        <HStack spacing={2}>
          <CurrencyBitcoinIcon sx={{ color: 'green' }} />
          <Text
            fontSize='12px'
            color='white'>
            Funded
          </Text>
        </HStack>
      );
    case 'NftIssued':
      return (
        <HStack spacing={2}>
          <CurrencyBitcoinIcon sx={{ color: 'green' }} />
          <Text
            fontSize='12px'
            color='white'>
            NFT Issued
          </Text>
        </HStack>
      );
    case 'PreRepaid':
      return (
        <HStack spacing={2}>
          <HourglassEmptyIcon sx={{ color: 'orange' }} />
          <Text
            fontSize='12px'
            color='white'>
            Waiting to be repaid
          </Text>
        </HStack>
      );
    case 'Repaid':
      return (
        <HStack spacing={2}>
          <PaidIcon sx={{ color: 'green' }} />
          <Text
            fontSize='12px'
            color='white'>
            Closed
          </Text>
        </HStack>
      );
    case 'PreLiquidated':
      return (
        <HStack spacing={2}>
          <HourglassEmptyIcon sx={{ color: 'orange' }} />
          <Text
            fontSize='12px'
            color='white'>
            Waiting to be liquidated
          </Text>
        </HStack>
      );
    case 'Liquidated':
      return (
        <HStack spacing={2}>
          <CurrencyExchangeIcon sx={{ color: 'green' }} />
          <Text
            fontSize='12px'
            color='white'>
            Liquidated
          </Text>
        </HStack>
      );
    default:
      <Text>Unknown Status</Text>;
  }
}
