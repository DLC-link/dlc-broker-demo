import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import { Text, HStack, Image, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { easyTruncateAddress } from '../utils';
import eventBus from '../EventBus';

export default function Account({ address, isConnected, walletType, walletBalance }) {
  const [walletLogo, setWalletLogo] = useState(undefined);

  const walletLogos = {
    metamask: { src: '/mm_logo.png', alt: 'Metamask Logo', boxSize: [3, 6] },
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

  const disconnect = () => {
    eventBus.dispatch('account-information', {});
  };

  return (
    <Menu>
      {isConnected ? (
        <>
          <MenuButton
            height={[25, 50]}
            width={[250, 350]}
            borderRadius='lg'
            shadow='dark-lg'>
            <HStack>
              <HStack width={250}>
                {walletLogo && (
                  <Image
                    src={walletLogo.src}
                    alt={walletLogo.alt}
                    boxSize={walletLogo.boxSize}
                  />
                )}
                <CheckCircleIcon
                  boxSize={[2, 4]}
                  color='secondary1'
                />
                <Text fontSize={[5, 15]}>Account:{easyTruncateAddress(address)}</Text>
              </HStack>
              <HStack>
                <Image
                  src='/btc_logo.png'
                  alt='Bitcoin Logo'
                  boxSize={[3, 6]}
                  borderRadius='3px'></Image>
                <Text>{walletBalance}</Text>
              </HStack>
            </HStack>
          </MenuButton>
          <MenuList width={350}>
            <MenuItem onClick={disconnect}>Disconnect Wallet</MenuItem>
          </MenuList>
        </>
      ) : (
        <MenuButton
          height={[25, 50]}
          width={[250, 350]}
          borderRadius='lg'
          shadow='dark-lg'
          onClick={openSelectWalletModal}>
          <HStack>
            <HStack width={250}>
              <WarningIcon
                boxSize={[1, 3]}
                color='primary1'
              />
              <Text
                fontWeight='extrabold'
                fontSize={[5, 15]}>
                Connect Wallet
              </Text>
            </HStack>
            <HStack>
              <Image
                src='/btc_logo.png'
                alt='Bitcoin Logo'
                boxSize={[3, 6]}
                borderRadius='3px'></Image>
              <IconButton
                _hover={{
                  background: 'secondary1',
                }}
                isLoading
                variant='outline'
                color='white'
                borderRadius='full'
                width={[20, 30]}
                height={[20, 30]}></IconButton>
            </HStack>
          </HStack>
        </MenuButton>
      )}
    </Menu>
  );
}
