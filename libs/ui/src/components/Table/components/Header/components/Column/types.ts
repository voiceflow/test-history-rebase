import type React from 'react';

import type { TippyTooltipProps } from '@/components/TippyTooltip';

export interface Props extends React.PropsWithChildren {
  flex: number;
  width?: number;
  active?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  tooltip?: TippyTooltipProps;
  sortable?: boolean;
  descending?: boolean;
}
