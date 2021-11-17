import type { Theme } from '@ui/styles/theme';
import * as StyledComponents from 'styled-components';

// eslint-disable-next-line import/prefer-default-export
export const useTheme = StyledComponents.useTheme as () => Theme;
