import React from 'react';

import { Icon } from '@/components/SvgIcon';
import { BlockState, BlockVariant } from '@/constants/canvas';

export type SectionProps = React.PropsWithChildren<{
  icon?: Icon;
  name: string;
  state: BlockState;
  variant: BlockVariant;
}>;

export type SectionItemProps = WithOptional<SectionProps, 'state' | 'variant'>;
