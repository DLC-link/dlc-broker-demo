import React from 'react';
import { Text, HStack, VStack } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { selectTotalRedeemable, selectTotalNFTs } from '../store/vaultsSlice';
import { customShiftValue } from '../utilities/formatFunctions';

export default function Balance() {
    const totalRedeemable = useSelector(selectTotalRedeemable);
    const numberOfNFTs = useSelector(selectTotalNFTs);

    const BalanceContainer = ({ children }) => {
        return (
            <HStack
                padding={15}
                width={275}
                border={'1px solid white'}
                borderRadius={'lg'}
                shadow={'dark-lg'}
                justifyContent={'space-between'}
            >
                {children}
            </HStack>
        );
    };

    const BalanceTextStack = ({ header, data }) => {
        return (
            <VStack width={125}>
                <Text fontSize="small" fontWeight="extrabold" color="accent">
                    {header}
                </Text>
                <Text>{data}</Text>
            </VStack>
        );
    };

    return (
        <BalanceContainer>
            <BalanceTextStack
                header={'BTC Collateral:'}
                data={customShiftValue(totalRedeemable, 8, true) + ' BTC'}
            />
            <BalanceTextStack header={'Owned NFTs:'} data={numberOfNFTs} />
        </BalanceContainer>
    );
}
