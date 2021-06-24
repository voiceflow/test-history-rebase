import React from 'react';
import { ThemeContext } from 'styled-components';

import { createTheme } from '../src/styles';

const theme = createTheme({});

export const ThemeProvider: React.FC = ({ children }) => {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};
