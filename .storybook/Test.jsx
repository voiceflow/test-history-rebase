import React from 'react';
import { ThemeProvider } from 'styled-components';

import theme from '@/styles/theme';
import { FlexAround } from '@/componentsV2/Flex';

function Test({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <FlexAround style={{ flexWrap: 'wrap', fontFamily: '"Open Sans", sans-serif' }}>{children}</FlexAround>
    </ThemeProvider>
  );
}

export default Test;
