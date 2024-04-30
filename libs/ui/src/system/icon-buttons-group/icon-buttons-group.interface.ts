import type React from 'react';

import type { BoxProps } from '@/components/Box';
import type { FlexProps } from '@/components/Flex';
import type * as IconButton from '@/system/icon-button';

export interface Props extends Omit<BoxProps, 'alignItems'>, FlexProps, React.PropsWithChildren {
  size?: IconButton.Size;
}
