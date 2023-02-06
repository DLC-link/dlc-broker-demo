import { menuAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(menuAnatomy.keys);

const baseStyle = definePartsStyle({
  tab: {
    margin: '15px',
    padding: '15px',
    shadow: '2xl',
    color: 'white',
    borderRadius: 'lg',
    border: '1px',
    borderColor: 'white',
    bg: 'transparent',
    _selected: {
      color: 'white',
      bg: 'secondary1',
      border: '1px',
      borderColor: 'white'
    },
    _hover: {
      color: 'white',
      bg: 'secondary1',
      border: '1px',
      borderColor: 'white'
    },
  },
});
export const tabsTheme = defineMultiStyleConfig({ baseStyle });
