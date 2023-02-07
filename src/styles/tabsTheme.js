import { menuAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(menuAnatomy.keys);

const baseStyle = definePartsStyle({
  tab: {
    margin: '15px',
    padding: '15px',
    shadow: '2xl',
    bg: 'transparent',
    color: 'white',
    border: '1px',
    borderColor: 'white',
    borderRadius: 'lg',
    _selected: {
      color: 'accent',
      border: '1px',
      borderColor: 'accent',
    },
    _hover: {
      border: '1px',
      borderColor: 'accent',
      color: 'accent',
    },
  },
});
export const tabsTheme = defineMultiStyleConfig({ baseStyle });
