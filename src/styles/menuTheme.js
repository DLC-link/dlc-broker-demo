import { menuAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(menuAnatomy.keys);

const baseStyle = definePartsStyle({
  button: {
    padding: '15px',
    width: '250px',
    shadow: '2xl',
    borderRadius: 'md',
    border: '1px',
    borderColor: 'accent',
    bg: 'transparent',
    _hover: {
      borderColor: 'white',
    },
  },
  list: {
    borderRadius: 'md',
    width: '250px',
    bg: 'white',
    dropShadow: '2xl',
  },
  item: {
    bgGradient: 'linear(to-r, secondary1, secondary2)',
    bgClip: 'text',
    padding: '15px',
    justifyContent: 'center',
    fontWeight: 'extrabold',
  },
});
export const menuTheme = defineMultiStyleConfig({ baseStyle });
