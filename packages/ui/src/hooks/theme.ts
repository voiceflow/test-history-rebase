import type { Theme } from '@ui/styles/theme';
import * as StyledComponents from 'styled-components';

export const useTheme = StyledComponents.useTheme as () => Theme;
