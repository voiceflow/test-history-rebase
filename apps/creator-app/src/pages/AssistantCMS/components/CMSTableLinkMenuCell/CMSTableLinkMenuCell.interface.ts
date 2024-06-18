import { IconName } from '@voiceflow/icons';

export interface ICMSTableLinkMenuCell<Item> {
  label: string;
  items: Item[];
  onClick: VoidFunction;
  updates?: number;
  iconName?: IconName;
  children: (props: { items: Item[] }) => React.ReactNode[];
}
