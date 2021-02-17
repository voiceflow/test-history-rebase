import React from 'react';
import * as StyledComponents from 'styled-components';

import THEME from '@/styles/theme';

export const ThemeProvider = ({ children }) => <StyledComponents.ThemeProvider theme={THEME}>{children}</StyledComponents.ThemeProvider>;

// eslint-disable-next-line react/display-name
export default (Component) => (props) => (
  <ThemeProvider>
    <Component {...props} />
  </ThemeProvider>
);
