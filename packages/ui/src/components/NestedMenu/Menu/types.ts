import { MenuProps } from '@ui/components/Menu';
import { Nullable } from '@voiceflow/common';
import React from 'react';

import {
  GetOptionKey,
  GetOptionLabel,
  GetOptionValue,
  MenuItemGrouped,
  MenuItemMultilevel,
  MenuItemWithID,
  RenderOptionLabel,
  SharedNestedMenuProps,
  UIOnlyMenuItemOption,
} from '../types';

interface BaseNestedMenuProps extends SharedNestedMenuProps {
  id?: string;
  isRoot?: boolean;
  minWidth?: number;
  maxHeight?: number | string;
  menuProps?: Omit<MenuProps<unknown>, 'onSelect' | 'options' | 'children'>;
  searchable?: boolean;
  isDropdown?: boolean;
  searchLabel?: string;
  optionsPath?: number[];
  createLabel?: React.ReactNode;
  containerRef?: React.Ref<HTMLDivElement>;
  onFocusOption?: (index: number) => void;
  inputWrapperNode?: Nullable<HTMLDivElement>;
  isButtonDisabled?: (options: { value: string }) => boolean;
  formatInputValue?: (value: string) => string;
  alwaysShowCreate?: boolean;
  inDropdownSearch?: boolean;
  disableAnimation?: boolean;
  firstOptionIndex?: number;
  directSearchMatch?: boolean;
  focusedOptionIndex?: Nullable<number>;
  renderSearchSuffix?: Nullable<(options: { close: VoidFunction; searchLabel: string }) => React.ReactNode>;
  renderFooterAction?: Nullable<(options: { close: VoidFunction; searchLabel: string }) => React.ReactNode>;
  onBackFocusToParent?: VoidFunction;
  onChangeSearchLabel?: React.ChangeEventHandler<HTMLInputElement>;
  createInputPlaceholder?: string;
}

interface BaseGenericNestedMenuProps<Option, Value> {
  options: Array<Option | UIOnlyMenuItemOption>;
  onSelect: (value: Value, optionsPath: number[], scheduleUpdate: VoidFunction) => void;
}

interface GenericNestedMenuProps<Option, Value> extends BaseGenericNestedMenuProps<Option, Value> {
  getOptionLabel: GetOptionLabel<Value>;
  getOptionValue: GetOptionValue<Option, Value>;
  renderOptionLabel: RenderOptionLabel<Option, Value>;
}

interface GenericNestedMenuGroupedProps<Option, GroupedOption extends MenuItemGrouped<Option>, Value>
  extends BaseGenericNestedMenuProps<GroupedOption, Value> {
  getOptionLabel: GetOptionLabel<Value>;
  getOptionValue: GetOptionValue<Option, Value>;
  renderOptionLabel: RenderOptionLabel<Option, Value>;
}

interface OptionalProps<Option> {
  grouped?: boolean;
  onCreate?: (value: string, scheduleUpdate: VoidFunction) => void;
  creatable?: boolean;
  isMultiLevel?: boolean;
  getOptionKey?: GetOptionKey<Option>;
}

export interface NestedMenuProps<Option, Value> extends BaseNestedMenuProps, OptionalProps<Option>, GenericNestedMenuProps<Option, Value> {
  getOptionKey: GetOptionKey<Option>;
}

export interface NestedMenuCreatableProps<Option, Value> extends BaseNestedMenuProps, OptionalProps<Option>, GenericNestedMenuProps<Option, Value> {
  onCreate: (value: string, scheduleUpdate: VoidFunction) => void;
  creatable: true;
  getOptionKey: GetOptionKey<Option>;
}

export interface NestedMenuWithIDProps<Option extends MenuItemWithID, Value>
  extends BaseNestedMenuProps,
    OptionalProps<Option>,
    GenericNestedMenuProps<Option, Value> {}

export interface NestedMenuCreatableWithIDProps<Option extends MenuItemWithID, Value>
  extends BaseNestedMenuProps,
    OptionalProps<Option>,
    GenericNestedMenuProps<Option, Value> {
  onCreate: (value: string, scheduleUpdate: VoidFunction) => void;
  creatable: true;
}

export interface NestedMenuMultilevelProps<Option extends MenuItemMultilevel<Option>, Value>
  extends BaseNestedMenuProps,
    OptionalProps<Option>,
    GenericNestedMenuProps<Option, Value> {
  isMultiLevel: true;
  getOptionKey: GetOptionKey<Option>;
}

export interface NestedMenuWithIDMultilevelProps<Option extends MenuItemWithID & MenuItemMultilevel<Option>, Value>
  extends BaseNestedMenuProps,
    OptionalProps<Option>,
    GenericNestedMenuProps<Option, Value> {
  isMultiLevel: true;
}

export interface NestedMenuGroupedProps<Option, GroupedOption extends MenuItemGrouped<Option>, Value>
  extends BaseNestedMenuProps,
    OptionalProps<Option>,
    GenericNestedMenuGroupedProps<Option, GroupedOption, Value> {
  grouped: true;
  getOptionKey: GetOptionKey<Option>;
}

export interface NestedMenuWithIDGroupedProps<Option extends MenuItemWithID, GroupedOption extends MenuItemGrouped<Option>, Value>
  extends BaseNestedMenuProps,
    OptionalProps<Option>,
    GenericNestedMenuGroupedProps<Option, GroupedOption, Value> {
  grouped: true;
}

export interface NestedMenuInternalProps extends BaseNestedMenuProps, GenericNestedMenuProps<unknown, unknown>, OptionalProps<unknown> {}
