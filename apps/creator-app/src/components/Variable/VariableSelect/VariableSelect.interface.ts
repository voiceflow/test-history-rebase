import type { IconName } from '@voiceflow/icons';

import type { IVariableMenu } from '../VariableMenu/VariableMenu.interface';

export interface IVariableSelect extends Pick<IVariableMenu, 'onSelect' | 'excludeVariableIDs'> {
  menuProps?: Omit<IVariableMenu, 'onSelect' | 'excludeVariableIDs'>;
  variableID?: string | null;
  label?: string;
  error?: boolean;
  prefixIcon?: IconName;
  editSelected?: boolean;
}
