import './setupVite';

import { createTheme } from '@voiceflow/ui';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';

import App from './App';

const theme = createTheme({});

const root = createRoot(document.getElementById('root')!);

root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);
