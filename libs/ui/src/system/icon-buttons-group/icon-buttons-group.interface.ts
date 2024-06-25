import type { BoxProps } from '@ui/components/Box';
import type { FlexProps } from '@ui/components/Flex';
import type * as IconButton from '@ui/system/icon-button';
import type React from 'react';

export interface Props extends Omit<BoxProps, 'alignItems'>, FlexProps, React.PropsWithChildren {
  size?: IconButton.Size;
}
