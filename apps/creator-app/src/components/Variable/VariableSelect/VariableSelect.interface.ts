import { IVariableMenu } from '../VariableMenu/VariableMenu.interface';

export interface IVariableSelect extends Pick<IVariableMenu, 'onSelect' | 'excludeVariableIDs'> {
  menuProps?: Omit<IVariableMenu, 'onSelect' | 'excludeVariableIDs'>;
  variableID?: string | null;
}
