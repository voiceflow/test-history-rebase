import type { IMenuItem } from '@voiceflow/ui-next';
import type { ITooltip } from '@voiceflow/ui-next/build/cjs/components/Utility/Tooltip/Tooltip.interface';

export interface IMenuItemWithTooltip extends Omit<IMenuItem, 'children'> {
  tooltip?: Omit<ITooltip, 'inline' | 'children' | 'referenceElement'>;
  children: ITooltip['children'];
}
