import { Utils, WithRequired } from '@voiceflow/common';

import { BaseMenuItem, MenuItemGrouped, MenuItemMultilevel, MenuItemWithID, UIOnlyMenuItemOption } from './types';

export const isBaseMenuItem = (option: unknown): option is BaseMenuItem => Utils.object.isObject(option);

export const isMenuItemWithID = (option: unknown): option is MenuItemWithID => isBaseMenuItem(option) && 'id' in option;

export const isGroupedOptions = (grouped: boolean, options: unknown[]): options is MenuItemGrouped<unknown>[] => grouped && Array.isArray(options);

export const isMenuItemGrouped = (grouped: boolean, option: unknown): option is MenuItemGrouped<unknown> => grouped && !!option;

export const isMultilevelOptions = (multilevel: boolean, options: unknown[]): options is MenuItemMultilevel<unknown>[] =>
  multilevel && Array.isArray(options);

export const isMenuItemMultilevel = (multilevel: boolean, option: unknown): option is MenuItemMultilevel<unknown> => multilevel && !!option;

export const isMenuItemOption = (value: unknown): value is WithRequired<BaseMenuItem, 'menuItemProps'> =>
  isBaseMenuItem(value) && Utils.object.hasProperty(value, 'menuItemProps');

export const isUIOnlyMenuItemOption = (value: unknown): value is UIOnlyMenuItemOption => isBaseMenuItem(value) && !!value.vfUIOnly;

export const isNotUIOnlyMenuItemOption = <T>(value: T | UIOnlyMenuItemOption): value is T => isUIOnlyMenuItemOption(value) === false;

export const createUIOnlyMenuItemOption = (
  id: string,
  {
    label = '',
    tooltip = null,
    isEmpty = false,
    readOnly = true,
    disabled = false,
    groupHeader = false,
    menuItemProps = {},
  }: Partial<Omit<UIOnlyMenuItemOption, 'id' | 'vfUIOnly'>> = {}
): UIOnlyMenuItemOption => ({
  id,
  label,
  tooltip,
  vfUIOnly: true,
  isEmpty,
  readOnly,
  disabled,
  groupHeader,
  menuItemProps,
});

export const createDividerMenuItemOption = (id = 'divider') => createUIOnlyMenuItemOption(id, { menuItemProps: { divider: true } });
