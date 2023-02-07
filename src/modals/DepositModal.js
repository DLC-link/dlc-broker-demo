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
  Table,
  Tr,
  Td,
  Tbody,
  TableContainer,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  customShiftValue,
  fixedTwoDecimalUnshift,
  countCollateralToDebtRatio,
  formatCollateralInUSD,
  formatBitcoinInUSDAmount,
} from '../utils';
import eventBus from '../EventBus';
import { sendLoanContractToEthereum } from '../blockchainFunctions/ethereumFunctions';

export default function DepositModal({ isOpen, closeModal, walletType, blockchain, Z }) {
  const [collateralAmount, setCollateralAmount] = useState(undefined);
  //setLiquidation, setLiquidationFee will be used in the future
  const [liquidationRatio, setLiquidationRatio] = useState(140);
  const [liquidationFee, setLiquidationFee] = useState(10);
  const [bitCoinInUSDAsString, setBitCoinInUSDAsString] = useState();
  const [bitCoinInUSDAsNumber, setBitCoinInUSDAsNumber] = useState();
  const [USDAmount, setUSDAmount] = useState(0);
  const [isCollateralError, setCollateralError] = useState(true);

  useEffect(() => {
    async function fetchData() {
      await fetchBitcoinPrice();
    }
    fetchData();
  }, []);

  useEffect(() => {
    setUSDAmount(formatCollateralInUSD(collateralAmount, bitCoinInUSDAsNumber));
  }, [collateralAmount, bitCoinInUSDAsNumber]);

  const handleCollateralChange = (collateralAmount) => setCollateralAmount(collateralAmount.target.value);

  const createAndSendLoanContract = () => {
    sendLoanContract(createLoanContract());
  };

  const createLoanContract = () => ({
    BTCDeposit: parseInt(customShiftValue(collateralAmount, 8, false)),
    liquidationRatio: fixedTwoDecimalUnshift(liquidationRatio),
    liquidationFee: fixedTwoDecimalUnshift(liquidationFee),
    emergencyRefundTime: 5,
  });

  const sendLoanContract = (loanContract) => {
    switch (walletType) {
      case 'metamask':
        sendLoanContractToEthereum(loanContract);
        break;
      default:
        console.log('Unsupported wallet type!');
        break;
    }
  };

  const fetchBitcoinPrice = async () => {
    await fetch('/.netlify/functions/get-bitcoin-price', {
      headers: { accept: 'Accept: application/json' },
    })
      .then((x) => x.json())
      .then(({ msg }) => {
        const bitcoinValue = formatBitcoinInUSDAmount(msg);
        setBitCoinInUSDAsNumber(bitcoinValue);
        setBitCoinInUSDAsString(new Intl.NumberFormat().format(bitcoinValue));
      });
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
            <TableContainer
              margin='15px'
              width='350px'>
              <Table variant='unstyled'>
                <Tbody>
                  <Tr>
                    <Td
                      fontSize='sm'
                      color='white'>
                      Liquidation ratio:
                    </Td>
                    <Td
                      fontSize='sm'
                      color='white'>
                      {liquidationRatio}%
                    </Td>
                  </Tr>
                  <Tr>
                    <Td
                      fontSize='sm'
                      color='white'>
                      Liquidation fee:
                    </Td>
                    <Td
                      fontSize='sm'
                      color='white'>
                      {liquidationFee}%
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
            <Flex justifyContent='center'>
              <Button
                // isDisabled={isError}
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
