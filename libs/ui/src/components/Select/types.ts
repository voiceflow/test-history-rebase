import { SvgIconTypes } from '@ui/components/SvgIcon';
import { Primitive } from '@ui/types';
import { Nullable, Nullish } from '@voiceflow/common';
import { PopperProps } from 'old-react-popper';
import React from 'react';

import {
  GetOptionKey,
  GetOptionLabel,
  GetOptionValue,
  MenuItemGrouped,
  MenuItemMultilevel,
  MenuItemWithID,
  RenderOptionLabel,
  UIOnlyMenuItemOption,
} from '../NestedMenu';

interface FilterConfig<Option, Value> {
  grouped?: boolean;
  maxSize?: number;
  isMultiLevel?: boolean;
  showNotMatched?: boolean;
  getOptionLabel: GetOptionLabel<Value>;
  getOptionValue: GetOptionValue<Option, Value>;
}

interface TriggerRendererOptions {
  ref: React.RefObject<HTMLElement>;
  value: string;
  isOpen: boolean;
  opened: boolean;
  inline: boolean;
  isEmpty: boolean;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: (event?: React.FocusEvent) => void;
  onClick?: (event?: React.MouseEvent) => void;
  onChange: React.ChangeEventHandler;
  disabled?: boolean;
  isFocused: boolean;
  fullWidth?: boolean;
  autoFocus?: boolean;
  isDropdown: boolean;
  leftAction?: React.ReactNode;
  searchable?: boolean;
  borderLess?: boolean;
  onOpenMenu?: VoidFunction;
  onHideMenu?: VoidFunction;
  placeholder?: string;
  rightAction?: React.ReactNode;
  isDropDownOpened: boolean;
}

export type OptionsFilter<Option, Value> = (
  options: Array<Option | UIOnlyMenuItemOption>,
  searchLabel: string,
  config: FilterConfig<Option, Value>
) => FilterResult<Option>;

export interface FilterResult<Option> {
  matchedOptions: Array<Option | UIOnlyMenuItemOption>;
  filteredOptions: Array<Option | UIOnlyMenuItemOption>;
  notMatchedOptions: Array<Option | UIOnlyMenuItemOption>;
}

export enum SelectInputVariant {
  TAGS = 'tags',
  DROPDOWN = 'dropdown',
  COUNTER = 'counter',
  SELECTED = 'selected',
}

export interface BaseSelectProps {
  id?: string;
  icon?: SvgIconTypes.Icon;
  open?: boolean;
  label?: string;
  error?: boolean;
  inline?: boolean;
  onBlur?: React.FocusEventHandler<HTMLElement>;
  onOpen?: VoidFunction;
  prefix?: React.ReactNode;
  onClose?: VoidFunction;
  onSearch?: (value: string) => void;
  minWidth?: boolean | string;
  maxWidth?: string | number;
  disabled?: boolean;
  useLayers?: boolean;
  placement?: PopperProps['placement'];
  modifiers?: PopperProps['modifiers'];
  autoWidth?: boolean;
  fullWidth?: boolean;
  autoFocus?: boolean;
  maxHeight?: number | string;
  className?: string;
  iconProps?: Partial<Omit<SvgIconTypes.Props, 'icon'>>;
  onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
  noOverflow?: boolean;
  isDropdown?: boolean;
  renderTags?: Nullable<() => React.ReactNode | React.ReactNode[]>;
  borderLess?: boolean;
  searchable?: boolean;
  leftAction?: {
    icon: SvgIconTypes.Icon;
    onClick: VoidFunction;
    disabled?: boolean;
    isActive?: boolean;
    iconProps?: Partial<Omit<SvgIconTypes.Props, 'icon'>>;
  };
  rightAction?: React.ReactNode;
  createLabel?: string;
  displayName?: string;
  searchLabel?: string;
  placeholder?: string;
  renderEmpty?: Nullable<(options: { search: string; close: VoidFunction }) => React.ReactNode>;
  onMouseDown?: React.MouseEventHandler;
  autoDismiss?: boolean;
  renderAsSpan?: boolean;
  minMenuWidth?: number;
  maxMenuWidth?: number;
  inputVariant?: SelectInputVariant;
  renderTrigger?: (options: TriggerRendererOptions) => React.ReactNode;
  inputStopProp?: boolean;
  optionsMaxSize?: number;
  autoInputWidth?: boolean;
  nestedModifiers?: PopperProps['modifiers'];
  labelSearchable?: boolean;
  alwaysShowCreate?: boolean;
  inDropdownSearch?: boolean;
  formatInputValue?: (value: string) => string;
  isButtonDisabled?: (options: { value: string }) => boolean;
  isSecondaryInput?: boolean;
  isSecondaryIcon?: boolean;
  renderFooterAction?: Nullable<(options: { close: VoidFunction; searchLabel: string }) => React.ReactNode>;
  renderSearchSuffix?: Nullable<(options: { close: VoidFunction; searchLabel: string }) => React.ReactNode>;
  syncOptionsOnRender?: boolean;
  showSearchInputIcon?: boolean;
  clearOnSelectActive?: boolean;
  nestedMenuAutoWidth?: boolean;
  autoUpdatePlacement?: boolean;
  showNotMatchedOptions?: boolean;
  createInputPlaceholder?: string;
  showDropdownColorOnActive?: boolean;
  width?: string;
}

interface GenericSelectProps<Option, Value> {
  options: Array<Option | UIOnlyMenuItemOption>;
  onSelect: (value: Value, optionsPath: number[]) => void | Promise<void>;
}

interface OptionalProps<Option, Value> {
  value?: Nullish<Value>;
  grouped?: boolean;
  onCreate?: (label: string) => void;
  creatable?: boolean;
  isMultiLevel?: boolean;
  getOptionKey?: GetOptionKey<Option>;
  optionsFilter?: OptionsFilter<Option, Value>;
  getOptionValue?: GetOptionValue<Option, Value>;
  getOptionLabel?: GetOptionLabel<Value>;
  validateCreate?: (value: string) => void;
  selectedOptions?: unknown[];
  renderOptionLabel?: RenderOptionLabel<Option, Value>;
  renderOptionsFilter?: (option: Option | UIOnlyMenuItemOption) => boolean;
}

export interface SelectPrimitiveProps<Option extends Primitive>
  extends BaseSelectProps,
    OptionalProps<Option, Option>,
    GenericSelectProps<Option, Option> {
  grouped?: never;
  clearable?: never;
}

export interface SelectPrimitiveClearableProps<Option extends Primitive>
  extends BaseSelectProps,
    OptionalProps<Option, Option>,
    GenericSelectProps<Option, Nullable<Option>> {
  clearable: boolean;
}

export interface SelectPrimitiveCreatableProps<Option extends Primitive>
  extends BaseSelectProps,
    OptionalProps<Option, Option>,
    GenericSelectProps<Option, Option> {
  onCreate: (label: string) => void;
  creatable: true;
  clearable?: never;
}

export interface SelectPrimitiveCreatableClearableProps<Option extends Primitive>
  extends BaseSelectProps,
    OptionalProps<Option, Option>,
    GenericSelectProps<Option, Nullable<Option>> {
  onCreate: (label: string) => void;
  creatable: true;
  clearable: boolean;
}

export interface SelectWithIDProps<Option extends MenuItemWithID>
  extends BaseSelectProps,
    OptionalProps<Option, Option>,
    GenericSelectProps<Option, Option> {
  getOptionLabel: GetOptionLabel<Option>;
  clearable?: never;
}

export interface SelectWithIDClearableProps<Option extends MenuItemWithID>
  extends BaseSelectProps,
    OptionalProps<Option, Option>,
    GenericSelectProps<Option, Nullable<Option>> {
  clearable: boolean;
  getOptionLabel: GetOptionLabel<Option>;
}

export interface SelectValueWithIDProps<Option extends MenuItemWithID, Value>
  extends BaseSelectProps,
    OptionalProps<Option, Value>,
    GenericSelectProps<Option, Value> {
  getOptionValue: GetOptionValue<Option, Value>;
  getOptionLabel: GetOptionLabel<Value>;
  clearable?: never;
  grouped?: never;
}

export interface SelectValueWithIDClearableProps<Option extends MenuItemWithID, Value>
  extends BaseSelectProps,
    OptionalProps<Option, Value>,
    GenericSelectProps<Option, Nullable<Value>> {
  clearable: boolean;
  getOptionValue: GetOptionValue<Option, Value>;
  getOptionLabel: GetOptionLabel<Value>;
}

export interface SelectCreatableWithIDProps<Option extends MenuItemWithID>
  extends BaseSelectProps,
    OptionalProps<Option, Option>,
    GenericSelectProps<Option, Option> {
  onCreate: (label: string) => void;
  creatable: true;
  clearable?: never;
  getOptionLabel: GetOptionLabel<Option>;
}

export interface SelectCreatableWithIDClearableProps<Option extends MenuItemWithID>
  extends BaseSelectProps,
    OptionalProps<Option, Option>,
    GenericSelectProps<Option, Nullable<Option>> {
  onCreate: (label: string) => void;
  creatable: true;
  clearable: boolean;
  getOptionLabel: GetOptionLabel<Option>;
}

export interface SelectValueCreatableWithIDProps<Option extends MenuItemWithID, Value>
  extends BaseSelectProps,
    OptionalProps<Option, Value>,
    GenericSelectProps<Option, Value> {
  onCreate: (label: string) => void;
  creatable: true;
  clearable?: never;
  getOptionValue: GetOptionValue<Option, Value>;
  getOptionLabel: GetOptionLabel<Value>;
}

export interface SelectValueCreatableWithIDClearableProps<Option extends MenuItemWithID, Value>
  extends BaseSelectProps,
    OptionalProps<Option, Value>,
    GenericSelectProps<Option, Nullable<Value>> {
  onCreate: (label: string) => void;
  creatable: true;
  clearable: boolean;
  getOptionValue: GetOptionValue<Option, Value>;
  getOptionLabel: GetOptionLabel<Value>;
}

export interface SelectMultilevelProps<Option extends MenuItemMultilevel<Option>>
  extends BaseSelectProps,
    OptionalProps<Option, Option>,
    GenericSelectProps<Option, Option> {
  clearable?: never;
  isMultiLevel: true;
  getOptionKey: GetOptionKey<Option>;
  getOptionLabel: GetOptionLabel<Option>;
}

export interface SelectMultilevelClearableProps<Option extends MenuItemMultilevel<Option>>
  extends BaseSelectProps,
    OptionalProps<Option, Option>,
    GenericSelectProps<Option, Nullable<Option>> {
  clearable: boolean;
  isMultiLevel: true;
  getOptionKey: GetOptionKey<Option>;
  getOptionLabel: GetOptionLabel<Option>;
}

export interface SelectValueMultilevelProps<Option extends MenuItemMultilevel<Option>, Value>
  extends BaseSelectProps,
    OptionalProps<Option, Value>,
    GenericSelectProps<Option, Value> {
  clearable?: never;
  isMultiLevel: true;
  getOptionKey: GetOptionKey<Option>;
  getOptionValue: GetOptionValue<Option, Value>;
  getOptionLabel: GetOptionLabel<Value>;
}

export interface SelectValueMultilevelClearableProps<Option extends MenuItemMultilevel<Option>, Value>
  extends BaseSelectProps,
    OptionalProps<Option, Value>,
    GenericSelectProps<Option, Nullable<Value>> {
  clearable: boolean;
  isMultiLevel: true;
  getOptionKey: GetOptionKey<Option>;
  getOptionValue: GetOptionValue<Option, Value>;
  getOptionLabel: GetOptionLabel<Value>;
}

export interface SelectMultilevelWithIDProps<Option extends MenuItemWithID & MenuItemMultilevel<Option>>
  extends BaseSelectProps,
    OptionalProps<Option, Option>,
    GenericSelectProps<Option, Option> {
  clearable?: never;
  isMultiLevel: true;
  getOptionLabel: GetOptionLabel<Option>;
}

export interface SelectMultilevelWithIDClearableProps<Option extends MenuItemWithID & MenuItemMultilevel<Option>>
  extends BaseSelectProps,
    OptionalProps<Option, Option>,
    GenericSelectProps<Option, Nullable<Option>> {
  clearable: boolean;
  isMultiLevel: true;
  getOptionLabel: GetOptionLabel<Option>;
}

export interface SelectMultilevelValueWithIDProps<Option extends MenuItemWithID & MenuItemMultilevel<Option>, Value>
  extends BaseSelectProps,
    OptionalProps<Option, Value>,
    GenericSelectProps<Option, Value> {
  clearable?: never;
  isMultiLevel: true;
  getOptionValue: GetOptionValue<Option, Value>;
  getOptionLabel: GetOptionLabel<Value>;
}

export interface SelectMultilevelValueWithIDClearableProps<Option extends MenuItemWithID & MenuItemMultilevel<Option>, Value>
  extends BaseSelectProps,
    OptionalProps<Option, Value>,
    GenericSelectProps<Option, Nullable<Value>> {
  clearable: boolean;
  isMultiLevel: true;
  getOptionValue: GetOptionValue<Option, Value>;
  getOptionLabel: GetOptionLabel<Value>;
}

export interface SelectGroupedProps<Option, GroupOption extends MenuItemGrouped<Option>>
  extends BaseSelectProps,
    OptionalProps<Option, Option>,
    GenericSelectProps<GroupOption, Option> {
  grouped: true;
  clearable?: never;
  getOptionKey: GetOptionKey<Option>;
  getOptionLabel: GetOptionLabel<Option>;
}

export interface SelectGroupedClearableProps<Option, GroupOption extends MenuItemGrouped<Option>>
  extends BaseSelectProps,
    OptionalProps<Option, Option>,
    GenericSelectProps<GroupOption, Nullable<Option>> {
  grouped: true;
  clearable: boolean;
  getOptionKey: GetOptionKey<Option>;
  getOptionLabel: GetOptionLabel<Option>;
}

export interface SelectValueGroupedProps<Option, GroupOption extends MenuItemGrouped<Option>, Value>
  extends BaseSelectProps,
    OptionalProps<Option, Value>,
    GenericSelectProps<GroupOption, Value> {
  grouped: true;
  clearable?: never;
  getOptionKey: GetOptionKey<Option>;
  getOptionValue: GetOptionValue<Option, Value>;
  getOptionLabel: GetOptionLabel<Value>;
}

export interface SelectValueGroupedClearableProps<Option, GroupOption extends MenuItemGrouped<Option>, Value>
  extends BaseSelectProps,
    OptionalProps<Option, Value>,
    GenericSelectProps<GroupOption, Nullable<Value>> {
  grouped: true;
  clearable: boolean;
  getOptionKey: GetOptionKey<Option>;
  getOptionValue: GetOptionValue<Option, Value>;
  getOptionLabel: GetOptionLabel<Value>;
}

export interface SelectGroupedWithIDProps<Option extends MenuItemWithID, GroupOption extends MenuItemGrouped<Option>>
  extends BaseSelectProps,
    OptionalProps<Option, Option>,
    GenericSelectProps<GroupOption, Option> {
  grouped: true;
  clearable?: never;
  getOptionLabel: GetOptionLabel<Option>;
}

export interface SelectGroupedWithIDClearableProps<Option extends MenuItemWithID, GroupOption extends MenuItemGrouped<Option>>
  extends BaseSelectProps,
    OptionalProps<Option, Option>,
    GenericSelectProps<GroupOption, Nullable<Option>> {
  grouped: true;
  clearable: boolean;
  getOptionLabel: GetOptionLabel<Option>;
}

export interface SelectGroupedValueWithIDProps<Option extends MenuItemWithID, GroupOption extends MenuItemGrouped<Option>, Value>
  extends BaseSelectProps,
    OptionalProps<Option, Value>,
    GenericSelectProps<GroupOption, Value> {
  grouped: true;
  clearable?: never;
  getOptionValue: GetOptionValue<Option, Value>;
  getOptionLabel: GetOptionLabel<Value>;
}

export interface SelectGroupedValueWithIDClearableProps<Option extends MenuItemWithID, GroupOption extends MenuItemGrouped<Option>, Value>
  extends BaseSelectProps,
    OptionalProps<Option, Value>,
    GenericSelectProps<GroupOption, Nullable<Value>> {
  grouped: true;
  clearable: boolean;
  getOptionValue: GetOptionValue<Option, Value>;
  getOptionLabel: GetOptionLabel<Value>;
}

export interface SelectProps<Option> extends BaseSelectProps, OptionalProps<Option, Option>, GenericSelectProps<Option, Option> {
  clearable?: never;
  getOptionKey: GetOptionKey<Option>;
  getOptionLabel: GetOptionLabel<Option>;
}

export interface SelectClearableProps<Option> extends BaseSelectProps, OptionalProps<Option, Option>, GenericSelectProps<Option, Nullable<Option>> {
  clearable: boolean;
  getOptionKey: GetOptionKey<Option>;
  getOptionLabel: GetOptionLabel<Option>;
}

export interface SelectValueProps<Option, Value> extends BaseSelectProps, OptionalProps<Option, Value>, GenericSelectProps<Option, Value> {
  clearable?: never;
  getOptionKey: GetOptionKey<Option>;
  getOptionValue: GetOptionValue<Option, Value>;
  getOptionLabel: GetOptionLabel<Value>;
}

export interface SelectValueClearableProps<Option, Value>
  extends BaseSelectProps,
    OptionalProps<Option, Value>,
    GenericSelectProps<Option, Nullable<Value>> {
  clearable: boolean;
  getOptionKey: GetOptionKey<Option>;
  getOptionValue: GetOptionValue<Option, Value>;
  getOptionLabel: GetOptionLabel<Value>;
}

export interface SelectCreatableProps<Option> extends BaseSelectProps, OptionalProps<Option, Option>, GenericSelectProps<Option, Option> {
  onCreate: (label: string) => void;
  creatable: true;
  clearable?: never;
  getOptionKey: GetOptionKey<Option>;
  getOptionLabel: GetOptionLabel<Option>;
}

export interface SelectCreatableClearableProps<Option>
  extends BaseSelectProps,
    OptionalProps<Option, Option>,
    GenericSelectProps<Option, Nullable<Option>> {
  onCreate: (label: string) => void;
  clearable: boolean;
  creatable: true;
  getOptionKey: GetOptionKey<Option>;
  getOptionLabel: GetOptionLabel<Option>;
}

export interface SelectValueCreatableProps<Option, Value> extends BaseSelectProps, OptionalProps<Option, Value>, GenericSelectProps<Option, Value> {
  onCreate: (label: string) => void;
  creatable: true;
  clearable?: never;
  getOptionKey: GetOptionKey<Option>;
  getOptionValue: GetOptionValue<Option, Value>;
  getOptionLabel: GetOptionLabel<Value>;
}

export interface SelectValueCreatableClearableProps<Option, Value>
  extends BaseSelectProps,
    OptionalProps<Option, Value>,
    GenericSelectProps<Option, Nullable<Value>> {
  onCreate: (label: string) => void;
  creatable: true;
  clearable: boolean;
  getOptionKey: GetOptionKey<Option>;
  getOptionValue: GetOptionValue<Option, Value>;
  getOptionLabel: GetOptionLabel<Value>;
}

export interface SelectInternalProps extends BaseSelectProps, OptionalProps<unknown, unknown>, GenericSelectProps<unknown, unknown> {
  clearable?: boolean;
}
