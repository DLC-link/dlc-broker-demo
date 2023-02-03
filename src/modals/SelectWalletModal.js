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
  Text,
  MenuButton,
  MenuItem,
  MenuList,
  Menu,
  Tooltip,
} from '@chakra-ui/react';
import { Image } from '@chakra-ui/react';
import { requestAndDispatchMetaMaskAccountInformation } from '../blockchainFunctions/ethereumFunctions';

export default function SelectWalletModal({ isOpen, closeModal }) {
  const blockchains = [{ id: 'ethereum:2', name: 'Testnet' }];

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      isCentered>
      <ModalOverlay />
      <ModalContent w='300px'>
        <ModalHeader
          bgGradient='linear(to-r, primary1, primary2)'
          bgClip='text'>
          Select Wallet
        </ModalHeader>
        <ModalCloseButton
          color='white'
          _focus={{
            boxShadow: 'none',
          }}
          bgGradient='linear(to-r, primary1, primary2)'
        />
        <ModalBody padding='25px'>
          <VStack>
            <Menu>
              {({ isOpen }) => (
                <>
                    <MenuButton
                      width='100%'
                      variant='outline'>
                      <HStack
                        w='100%'
                        justifyContent='center'>
                        <Image
                          src='/mm_logo.png'
                          alt='Metamask Logo'
                          width={25}
                          height={25}
                        />
                        <Text variant='selector'>{isOpen ? 'Choose Network' : 'Metamask'}</Text>
                      </HStack>
                    </MenuButton>
                  <MenuList>
                    {blockchains.map((blockchain, idx) => {
                      return (
                        <MenuItem
                          key={`chain-${idx}`}
                          onClick={() => {
                            requestAndDispatchMetaMaskAccountInformation();
                            closeModal();
                          }}>
                          <Text variant='selector'>{blockchain.name}</Text>
                        </MenuItem>
                      );
                    })}
                  </MenuList>
                </>
              )}
            </Menu>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
