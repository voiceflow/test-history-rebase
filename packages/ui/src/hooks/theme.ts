import * as StyledComponents from 'styled-components';

import type { Theme } from '../styles/theme';

// eslint-disable-next-line import/prefer-default-export
export const useTheme = StyledComponents.useTheme as () => Theme;
