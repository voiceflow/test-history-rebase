import { Nullable } from '@voiceflow/common';
import { TippyTooltipProps } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';

export interface Props extends Omit<S.ButtonProps, 'variant'> {
  tooltip?: Nullable<TippyTooltipProps>;
  expandable?: boolean;
  expandActive?: boolean;
  expandTooltip?: Nullable<TippyTooltipProps>;
  onExpandClick?: React.MouseEventHandler;
}
