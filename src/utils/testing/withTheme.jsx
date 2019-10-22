import React from 'react';
import { ThemeProvider } from 'styled-components';

import theme from '@/styles/theme';

// eslint-disable-next-line react/display-name
export default () => (Component) => (props) => (
  <ThemeProvider theme={theme}>
    <Component {...props} />
  </ThemeProvider>
);
