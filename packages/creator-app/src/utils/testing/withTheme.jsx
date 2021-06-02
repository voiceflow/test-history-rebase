import React from 'react';
import * as StyledComponents from 'styled-components';

import THEME from '@/styles/theme';

export const ThemeProvider = ({ children }) => <StyledComponents.ThemeProvider theme={THEME}>{children}</StyledComponents.ThemeProvider>;

export default (Component) => (props) =>
  (
    <ThemeProvider>
      <Component {...props} />
    </ThemeProvider>
  );
