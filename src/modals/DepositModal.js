import {
  VStack,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  Flex,
  Text,
  Image,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { customShiftValue, formatCollateralInUSD, formatBitcoinInUSDAmount } from '../utilities/format';
import { setupVault } from '../blockchainFunctions/ethereumFunctions';
import { fetchBitcoinPrice } from '../blockchainFunctions/bitcoinFunctions';
import eventBus from '../EventBus';

export default function DepositModal({ isOpen, closeModal, walletType }) {
  const [collateralAmount, setCollateralAmount] = useState(undefined);
  const [isCollateralError, setCollateralError] = useState(true);
  const [bitCoinInUSDAsString, setBitCoinInUSDAsString] = useState();
  const [bitCoinInUSDAsNumber, setBitCoinInUSDAsNumber] = useState();
  const [USDAmount, setUSDAmount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      await fetchBitcoinPrice().then((bitcoinPrice) => {
        setBitCoinInUSDAsNumber(bitcoinPrice);
        setBitCoinInUSDAsString(new Intl.NumberFormat().format(bitcoinPrice));
      });
    }
    fetchData();
  }, [isOpen]);

  useEffect(() => {
    setUSDAmount(formatCollateralInUSD(collateralAmount, bitCoinInUSDAsNumber));
    setCollateralError(collateralAmount < 0.0001 || collateralAmount === undefined);
  }, [collateralAmount, bitCoinInUSDAsNumber]);

  const handleCollateralChange = (collateralAmount) => setCollateralAmount(collateralAmount.target.value);

  const createAndSendLoanContract = () => {
    sendLoanContract(createVaultContract());
  };

  const createVaultContract = () => ({
    BTCDeposit: parseInt(customShiftValue(collateralAmount, 8, false)),
    emergencyRefundTime: 5,
  });

  const sendLoanContract = (vaultContract) => {
    switch (walletType) {
      case 'metamask':
        setupVault(vaultContract);
        break;
      default:
        console.log('Unsupported wallet type!');
        break;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      isCentered>
      <ModalOverlay />
      <ModalContent
        bg='background2'
        border='1px'
        color='accent'
        width={350}>
        <VStack>
          <ModalHeader color='white'>Request Vault</ModalHeader>
          <ModalCloseButton
            _focus={{
              boxShadow: 'none',
            }}
          />
          <ModalBody>
            <FormControl isInvalid={isCollateralError}>
              <FormLabel
                color='white'
                marginTop='15px'
                marginBottom='15px'
                marginLeft='40px'>
                Collateral Amount
              </FormLabel>
              {!isCollateralError ? (
                <FormHelperText
                  color='accent'
                  fontSize='x-small'
                  marginTop='15px'
                  marginBottom='15px'
                  marginLeft='40px'>
                  Enter the amount of Bitcoin you would like to deposit.
                </FormHelperText>
              ) : (
                <FormErrorMessage
                  fontSize='x-small'
                  marginTop='15px'
                  marginBottom='15px'
                  marginLeft='40px'>
                  Enter a valid amount of BTC
                </FormErrorMessage>
              )}
              <HStack
                marginLeft='40px'
                marginRight={50}
                spacing={45}>
                <NumberInput focusBorderColor='accent'>
                  <NumberInputField
                    padding={15}
                    color='white'
                    value={collateralAmount}
                    width={200}
                    onChange={handleCollateralChange}
                  />
                </NumberInput>
                <Image
                  src='/btc_logo.png'
                  alt='Bitcoin Logo'
                  width={25}
                  height={25}></Image>
              </HStack>
              <Text
                fontSize='x-small'
                color='white'
                marginLeft='40px'
                marginTop='15px'>
                ${USDAmount} at 1 BTC = ${bitCoinInUSDAsString}
              </Text>
            </FormControl>
            <Flex justifyContent='center'>
              <Button
                variant='outline'
                type='submit'
                onClick={createAndSendLoanContract}>
                REQUEST VAULT
              </Button>
            </Flex>
          </ModalBody>
        </VStack>
      </ModalContent>
    </Modal>
  );
}
