import React from 'react';
import { HStack } from '@chakra-ui/react';
import Account from './Account';
import CompanyWebsiteButton from './CompanyWebsiteButton';

export default function Header() {
    return (
        <HStack margin={[5, 35]} justifyContent={'space-between'}>
            <CompanyWebsiteButton />
            <Account />
        </HStack>
    );
}
