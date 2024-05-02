import type { RenderResult } from '@testing-library/react';
import { render } from '@testing-library/react';
import { ThemeContext } from 'styled-components';

import { createTheme } from '@/styles';

const theme = createTheme({});

const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const renderThemed = (jsx: JSX.Element): RenderResult => render(jsx, { wrapper: ThemeProvider });
