import type { TippyTooltipProps } from '@ui/components/TippyTooltip';
import type React from 'react';

export interface Props extends React.PropsWithChildren {
  flex: number;
  width?: number;
  active?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  tooltip?: TippyTooltipProps;
  sortable?: boolean;
  descending?: boolean;
}
