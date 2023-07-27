import React from 'react';
import { Text, Image, VStack } from '@chakra-ui/react';

export default function Intro() {
    function getRandomNumber() {
        return Math.floor(Math.random() * 15) + 1;
    }

    const randomPicture = getRandomNumber();
    const randomPictureFileName = `/maintenance_${randomPicture}.png`;
    return (
        <VStack marginTop="215px" justifyContent="center" alignItems="center">
            <Text
                height={['25px', '150px']}
                fontSize={['35px', '150px']}
                fontWeight="bold"
                color="accent"
            >
                Under Construction
            </Text>
            <Image
                src={randomPictureFileName}
                position="absolute"
                width="750px"
                blendMode="screen"
                borderRadius="full"
            ></Image>
        </VStack>
    );
}
