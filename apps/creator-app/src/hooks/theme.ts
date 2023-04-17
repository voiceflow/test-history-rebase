import * as StyledComponents from 'styled-components';

import type { Theme } from '@/styles/theme';

// eslint-disable-next-line prefer-destructuring
export const useTheme: () => Theme = StyledComponents.useTheme;
