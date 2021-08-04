import React from 'react';
import { useSelector } from 'react-redux';
import * as StyledComponents from 'styled-components';

import * as Admin from '@/ducks/adminV2';
import { getTheme } from '@/styles/theme';

const ThemeProvider: React.FC = ({ children }) => {
  const theme = useSelector(Admin.themeSelector);

  return <StyledComponents.ThemeProvider theme={getTheme(theme)}>{children}</StyledComponents.ThemeProvider>;
};

export default ThemeProvider;
