import { BoxProps } from '@ui/components/Box';
import { FlexProps } from '@ui/components/Flex';
import * as IconButton from '@ui/system/icon-button';
import React from 'react';

export interface Props extends Omit<BoxProps, 'alignItems'>, FlexProps, React.PropsWithChildren {
  size?: IconButton.Size;
}
