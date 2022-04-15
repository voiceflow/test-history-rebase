import 'styled-components';

import { Theme } from '@ui/styles/theme';

declare module 'styled-components' {
  interface DefaultTheme extends Theme {}
}
