import { createTheme } from '@ui/styles';
import React from 'react';
import { ThemeContext } from 'styled-components';

const theme = createTheme({});

export const ThemeProvider: React.OldFC = ({ children }) => {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};
