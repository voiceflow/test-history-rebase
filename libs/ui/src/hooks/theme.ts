import React from 'react';
import { useTheme as useStyledTheme } from 'styled-components';

import type { Theme } from '@/styles/theme';

export const useTheme = useStyledTheme as () => Theme;

export const useNestedPopperTheme = (zIndex?: number): Theme => {
  const theme = useTheme();

  return React.useMemo(
    () => ({ ...theme, zIndex: { ...theme.zIndex, popper: (zIndex ?? theme.zIndex.popper) + 1 } }),
    [theme, zIndex]
  );
};
