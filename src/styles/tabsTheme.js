import { menuAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(menuAnatomy.keys);

const baseStyle = definePartsStyle({
  tab: {
    margin: '15px',
    padding: '20px',
    shadow: '2xl',
    color: 'white',
    borderRadius: 'lg',
    border: '1px',
    borderColor: 'accent',
    bg: 'transparent',
    _selected: {
      bg: 'white',
      color: 'secondary2',
      border: '1px',
      borderColor: 'accent',
    },
    _hover: {
      border: '1px',
      borderColor: 'white',
    },
  },
});
export const tabsTheme = defineMultiStyleConfig({ baseStyle });
