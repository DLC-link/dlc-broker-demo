import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import { Text, HStack, Image, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { easyTruncateAddress } from '../utilities/formatFunctions';
import eventBus from '../utilities/eventBus';

export default function Account({ isConnected, walletType, address }) {
  const [walletLogo, setWalletLogo] = useState(undefined);

  const walletLogos = {
    metamask: { src: '/mm_logo.png', alt: 'Metamask Logo', boxSize: '25px' },
  };

  useEffect(() => {
    const currentWalletLogo = walletLogos[walletType];
    setWalletLogo(currentWalletLogo);
  }, [walletType]);

  const openSelectWalletModal = () => {
    eventBus.dispatch('is-select-wallet-modal-open', {
      isSelectWalletOpen: true,
    });
  };

  const disconnectWallet = () => {
    eventBus.dispatch('account-information', {});
    eventBus.dispatch('provider', false);
  };

  return (
    <Menu>
      {isConnected ? (
        <>
          <MenuButton
            margin='0px'
            height='50px'
            width='250px'
            borderRadius='lg'
            shadow='dark-lg'>
            <HStack>
              {walletLogo && (
                <Image
                  src={walletLogo.src}
                  alt={walletLogo.alt}
                  boxSize={walletLogo.boxSize}
                />
              )}
              <CheckCircleIcon
                boxSize='15px'
                color='secondary1'
              />
              <Text fontSize='15px'>Account:{easyTruncateAddress(address)}</Text>
            </HStack>
          </MenuButton>
          <MenuList width='250px' margin='0px'>
            <MenuItem onClick={disconnectWallet}>Disconnect Wallet</MenuItem>
          </MenuList>
        </>
      ) : (
        <MenuButton
          height='50px'
          width='250px'
          borderRadius='lg'
          shadow='dark-lg'
          onClick={openSelectWalletModal}>
          <HStack>
            <WarningIcon
              boxSize='15px'
              color='secondary2'
            />
            <Text
              fontSize='15px'
              fontWeight='bold'>
              Connect Wallet
            </Text>
          </HStack>
        </MenuButton>
      )}
    </Menu>
  );
}
