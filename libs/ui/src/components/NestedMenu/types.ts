import { MenuTypes } from '@ui/components/Menu';
import { TippyTooltipProps } from '@ui/components/TippyTooltip';
import { Nullish } from '@voiceflow/common';
import { Popper, PopperProps } from 'old-react-popper';
import React from 'react';

export interface BaseMenuItem {
  tooltip?: TippyTooltipProps | null;
  vfUIOnly?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  groupHeader?: boolean;
  menuItemProps?: Omit<MenuTypes.ItemProps, 'disabled' | 'readOnly'>;
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
  options?: Option[];
}

export interface MenuItemMultilevel<Option> extends BaseMenuItem {
  options?: Array<Option | UIOnlyMenuItemOption>;
  menuProps?: MenuTypes.BaseProps;
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
  close?: VoidFunction;
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
  nestedPopoverModifiers?: PopperProps['modifiers'];
}

export type NestedMenuContainerRef = Popper;
