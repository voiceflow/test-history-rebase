import { IconName } from '@voiceflow/icons';
import { IHotKey } from '@voiceflow/ui-next';

export interface IDiagramLayoutHeaderAction {
  onClick: VoidFunction;
  tooltip: { label: React.ReactNode; hotkeys: IHotKey[] };
  iconName: IconName;
  isActive?: boolean;
}
