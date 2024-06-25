import 'styled-components';

import type { Theme } from '@ui/styles/theme';

declare module 'styled-components' {
  interface DefaultTheme extends Theme {}
}
