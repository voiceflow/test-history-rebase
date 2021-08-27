import { WithOptional } from '@voiceflow/realtime-sdk';
import { Icon } from '@voiceflow/ui';
import React from 'react';

import { BlockState, BlockVariant } from '@/constants/canvas';

export type SectionProps = React.PropsWithChildren<{
  icon?: Icon;
  name: string;
  state: BlockState;
  variant: BlockVariant;
}>;

export type SectionItemProps = WithOptional<SectionProps, 'state' | 'variant'>;
