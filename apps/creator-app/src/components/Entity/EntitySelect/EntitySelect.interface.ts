import { BaseProps } from '@voiceflow/ui-next';

import { IEntityMenu } from '../EntityMenu/EntityMenu.interface';

export interface IEntitySelect extends BaseProps, Pick<IEntityMenu, 'onSelect' | 'excludeIDs'> {
  entityID?: string | null;
  menuProps?: Omit<IEntityMenu, 'onSelect' | 'excludeIDs'>;
}
