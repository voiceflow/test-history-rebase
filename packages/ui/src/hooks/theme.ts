import type { Theme } from '@ui/styles/theme';
import React from 'react';
import * as StyledComponents from 'styled-components';

export const useTheme = StyledComponents.useTheme as () => Theme;

export const useNestedPopperTheme = (zIndex?: number): Theme => {
  const theme = useTheme();

  return React.useMemo(() => ({ ...theme, zIndex: { ...theme.zIndex, popper: (zIndex ?? theme.zIndex.popper) + 1 } }), [theme, zIndex]);
};
