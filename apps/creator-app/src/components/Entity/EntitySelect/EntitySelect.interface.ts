import { IEntityMenu } from '../EntityMenu/EntityMenu.interface';

export interface IEntitySelect extends Pick<IEntityMenu, 'onSelect' | 'excludeEntitiesIDs'> {
  entityID?: string | null;
  menuProps?: Omit<IEntityMenu, 'onSelect' | 'excludeEntitiesIDs'>;
}
