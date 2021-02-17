import * as StyledComponents from 'styled-components';

import type { Theme } from '@/styles/theme';

export const useTheme: () => Theme = StyledComponents.useTheme;
