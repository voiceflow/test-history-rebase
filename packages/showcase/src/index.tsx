import './setupVite';

import { createTheme } from '@voiceflow/ui';
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';

import Examples from './examples';

const theme = createTheme({});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Examples />
  </ThemeProvider>,
  document.getElementById('root')
);
