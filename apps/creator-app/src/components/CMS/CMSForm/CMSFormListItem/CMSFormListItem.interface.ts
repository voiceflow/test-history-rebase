import type { IBox } from '@voiceflow/ui-next';

export interface ICMSFormListItem extends Omit<IBox, 'ml' | 'direction'> {
  index?: number;
  children: React.ReactNode;
  onRemove: React.MouseEventHandler<HTMLButtonElement>;
  showOnHover?: boolean;
  removeDisabled?: boolean;
  contentContainerProps?: IBox;
}
