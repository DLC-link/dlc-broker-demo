import React from 'react';
import { Button, HStack, Image, Spacer, Text } from '@chakra-ui/react';

export default function Header() {
    return (
        <>
            <HStack margin={['15px', '30px']}>
                <Button
                    variant="ghost"
                    as="a"
                    margin="0px"
                    boxSize={['65px', '97.5px']}
                    borderRadius="lg"
                    href="https://www.dlc.link/"
                    _hover={{
                        background: 'secondary1',
                    }}
                >
                    <Image src="/dlc.link_logo.svg" alt="DLC.Link Logo" />
                </Button>
                <Spacer />
                <Button
                    variant="ghost"
                    as="a"
                    margin="0px"
                    width="250px"
                    height={['65px', '97.5px']}
                    borderRadius="lg"
                    href="https://discord.gg/K49hUQRS"
                    _hover={{
                        background: 'secondary1',
                    }}
                >
                    <Image
                        height={['25px', '35px']}
                        src="/discord.svg"
                        alt="Discord Logo"
                    />
                    <Spacer />
                    <Text>Join Our Discord Channel!</Text>
                </Button>
            </HStack>
        </>
    );
}
