import { Text, HStack } from '@chakra-ui/react';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PaidIcon from '@mui/icons-material/Paid';

export default function Status({ status }) {
  const setStatusComponent = (status) => {
    switch (status) {
      case 0:
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
      case 1:
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
      case 2:
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
      case 3:
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
      case 4:
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
      case 5:
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
      case 6:
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
      case 7:
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
      case 8:
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
  };
  return setStatusComponent(status);
}
