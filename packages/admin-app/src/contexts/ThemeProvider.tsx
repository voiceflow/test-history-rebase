import { useContextApi, useLocalStorageState } from '@voiceflow/ui';
import React from 'react';
import * as StyledComponents from 'styled-components';

import { ThemeType } from '@/constants';
import { getTheme } from '@/styles/theme';

export const ThemeContext = React.createContext<{ theme: ThemeType; setTheme: (value: ThemeType) => void }>({
  theme: ThemeType.LIGHT,
  setTheme: () => {},
});

export const { Consumer: ThemeConsumer } = ThemeContext;

const ThemeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = useLocalStorageState('admin-theme', ThemeType.LIGHT);

  const api = useContextApi({ theme, setTheme });

  return (
    <ThemeContext.Provider value={api}>
      <StyledComponents.ThemeProvider theme={getTheme(theme)}>{children}</StyledComponents.ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
