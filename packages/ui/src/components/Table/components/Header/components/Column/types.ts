import type { TippyTooltipProps } from '@ui/components/TippyTooltip';

export interface Props {
  flex: number;
  width?: number;
  active?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  tooltip?: TippyTooltipProps;
  sortable?: boolean;
  descending?: boolean;
}
