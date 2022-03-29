import { MenuProps } from '@ui/components/Menu';
import { Nullish } from '@voiceflow/common';
import React from 'react';
import { PopperProps } from 'react-popper';

export interface MenuItemProps {
  style?: React.CSSProperties;
  ending?: boolean;
  divider?: boolean;
}

export interface BaseMenuItem {
  vfUIOnly?: boolean;
  disabled?: boolean;
  menuItemProps?: MenuItemProps;
  tooltip?: React.ReactNode;
}

export interface UIOnlyMenuItemOption extends Required<BaseMenuItem> {
  id: string;
  label: string;
  value?: null;
  vfUIOnly: true;
}

export interface MenuItemWithID extends BaseMenuItem {
  id: string;
}

export interface MenuItemGrouped<Option> extends BaseMenuItem {
  id: string;
  label: React.ReactNode;
  options?: Array<Option | UIOnlyMenuItemOption>;
}

export interface MenuItemMultilevel<Option> extends BaseMenuItem {
  options?: Array<Option | UIOnlyMenuItemOption>;
  menuProps?: Omit<MenuProps<unknown>, 'onSelect' | 'options' | 'children'>;
}

export interface MenuItemWithOptions<Option> extends BaseMenuItem {
  options: Option[];
}

export type GetOptionKey<Option> = (option: Option, index: number) => string;

export type GetOptionLabel<Value> = (value?: Nullish<Value>) => Nullish<React.ReactNode>;

export type GetOptionValue<Option, Value> = (option?: Nullish<Option>) => Nullish<Value>;

export interface RenderOptionLabelConfig {
  isFocused: boolean;
  optionsPath: number[];
}

export type RenderOptionLabel<Option, Value> = (
  option: Exclude<Option, UIOnlyMenuItemOption>,
  searchLabel: string,
  getOptionLabel: GetOptionLabel<Value>,
  getOptionValue: GetOptionValue<Option, Value>,
  config: RenderOptionLabelConfig
) => React.ReactNode;

export interface SharedNestedMenuProps {
  onHide: VoidFunction;
  autoWidth?: boolean;
  placement?: PopperProps['placement'];
  portalNode?: HTMLElement;
  renderEmpty?: Nullish<(options: { search: string; close: VoidFunction }) => React.ReactNode>;
  popoverModifiers?: PopperProps['modifiers'];
}
