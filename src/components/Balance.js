import React from 'react';
import { Text, HStack, Flex } from '@chakra-ui/react';

export default function Balance({ depositAmount, nftQuantity }) {
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
                        <Text paddingRight="25px">{depositAmount} BTC</Text>
                        <Text
                            paddingLeft="25px"
                            fontSize="small"
                            fontWeight="extrabold"
                            color="accent"
                        >
                            Owned NFTs:{' '}
                        </Text>
                        <Text>{nftQuantity}</Text>
                    </HStack>
                </Flex>
            </>
        </>
    );
}
