import { Utils } from '@voiceflow/common';

export interface MenuItemProps {
  style?: React.CSSProperties;
  ending?: boolean;
  divider?: boolean;
}

export interface MenuItemOptions {
  vfUIOnly?: boolean;
  menuItemProps?: MenuItemProps;
}

export interface UIOnlyMenuItemOption extends Required<MenuItemOptions> {
  id: string;
  label: string;
  value?: null;
  vfUIOnly: true;
}

export const isMenuItemOption = (value: unknown): value is MenuItemOptions =>
  typeof value === 'object' && Utils.object.hasProperty(value, 'menuItemProps');

export const isUIOnlyMenuItemOption = (value: any): value is UIOnlyMenuItemOption => value?.vfUIOnly === true;

export const isNotUIOnlyMenuItemOption = <T>(value: T | UIOnlyMenuItemOption): value is T => isUIOnlyMenuItemOption(value) === false;

export const createUIOnlyMenuItemOption = (id: string, menuItemProps: UIOnlyMenuItemOption['menuItemProps'] = {}): UIOnlyMenuItemOption => ({
  id,
  label: '',
  vfUIOnly: true,
  menuItemProps,
});
