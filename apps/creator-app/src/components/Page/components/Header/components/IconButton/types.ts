import type { Nullable } from '@voiceflow/common';
import type { TippyTooltipProps } from '@voiceflow/ui';
import type React from 'react';

import type * as S from './styles';

export interface Props extends Omit<S.ButtonProps, 'variant'> {
  tooltip?: Nullable<TippyTooltipProps>;
  expandable?: boolean;
  expandActive?: boolean;
  expandTooltip?: Nullable<TippyTooltipProps>;
  onExpandClick?: React.MouseEventHandler;
}
