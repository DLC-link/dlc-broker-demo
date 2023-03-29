import React from 'react';
import { Text, HStack, Flex } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { selectTotalRedeemable, selectTotalNFTs } from '../store/vaultsSlice';
import { customShiftValue } from '../utilities/formatFunctions';

export default function Balance() {
    const totalRedeemable = useSelector(selectTotalRedeemable);
    const numberOfNFTs = useSelector(selectTotalNFTs);
    return (
        <>
            <>
                <Flex
                    paddingTop="15px"
                    paddingBottom="15px"
                    height="15px"
                    width="350px"
                    border="1px"
                    borderRadius="lg"
                    borderColor="white"
                    shadow="dark-lg"
                    justifyContent="center"
                    align="center"
                >
                    <HStack>
                        <Text
                            fontSize="small"
                            fontWeight="extrabold"
                            color="accent"
                        >
                            Total Redeemable:{' '}
                        </Text>
                        <Text paddingRight="25px">
                            {customShiftValue(totalRedeemable, 8, true)} BTC
                        </Text>
                        <Text
                            paddingLeft="25px"
                            fontSize="small"
                            fontWeight="extrabold"
                            color="accent"
                        >
                            Owned NFTs:{' '}
                        </Text>
                        <Text>{numberOfNFTs}</Text>
                    </HStack>
                </Flex>
            </>
        </>
    );
}
