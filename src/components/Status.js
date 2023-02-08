import { Text, HStack } from '@chakra-ui/react';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PaidIcon from '@mui/icons-material/Paid';

export default function Status({ status }) {
  const statuses = {
    0: 'None',
    1: 'NotReady',
    2: 'Ready',
    3: 'Funded',
    4: 'NftIssued',
    5: 'PreRepaid',
    6: 'Repaid',
    7: 'PreLiquidated',
    8: 'Liquidated',
  };

  const setStatusComponent = (status) => {
    switch (status) {
      case 0:
        return (
          <HStack spacing={2}>
            <CurrencyBitcoinIcon sx={{ color: 'orange' }} />
            <Text
              color='white'
              fontSize={12}>
              Unfunded
            </Text>
          </HStack>
        );
      case 1:
        return (
          <HStack spacing={2}>
            <HourglassEmptyIcon sx={{ color: 'orange' }} />
            <Text
              color='white'
              fontSize={12}>
              Not ready
            </Text>
          </HStack>
        );
      case 2:
        return (
          <HStack spacing={2}>
            <CurrencyBitcoinIcon sx={{ color: 'orange' }} />
            <Text
              color='white'
              fontSize={12}>
              Ready
            </Text>
          </HStack>
        );
      case 3:
        return (
          <HStack spacing={2}>
            <CurrencyBitcoinIcon sx={{ color: 'green' }} />
            <Text
              color='white'
              fontSize={12}>
              Funded
            </Text>
          </HStack>
        );
      case 4:
        return (
          <HStack spacing={2}>
            <CurrencyBitcoinIcon sx={{ color: 'green' }} />
            <Text
              color='white'
              fontSize={12}>
              NFT Issued
            </Text>
          </HStack>
        );
      case 5:
        return (
          <HStack spacing={2}>
            <HourglassEmptyIcon sx={{ color: 'orange' }} />
            <Text
              color='white'
              fontSize={12}>
              Waiting to be repaid
            </Text>
          </HStack>
        );
      case 6:
        return (
          <HStack spacing={2}>
            <PaidIcon sx={{ color: 'green' }} />
            <Text
              color='white'
              fontSize={12}>
              Closed
            </Text>
          </HStack>
        );
      case 7:
        return (
          <HStack spacing={2}>
            <HourglassEmptyIcon sx={{ color: 'orange' }} />
            <Text
              color='white'
              fontSize={12}>
              Waiting to be liquidated
            </Text>
          </HStack>
        );
      case 8:
        return (
          <HStack spacing={2}>
            <CurrencyExchangeIcon sx={{ color: 'green' }} />
            <Text
              color='white'
              fontSize={12}>
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
