import { Nullable } from '@voiceflow/common';

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

interface BaseMenuOptionsProps extends SharedNestedMenuProps {
  onItemRef?: (index: number) => (node: HTMLLIElement | null) => void;
  optionsPath: number[];
  searchLabel?: string;
  onFocusItem?: (index: number) => void;
  updatePosition?: VoidFunction;
  firstOptionIndex: number;
  inputWrapperNode?: Nullable<HTMLDivElement>;
  focusedOptionIndex: Nullable<number>;
  childFocusItemIndex: Nullable<number>;
  onBackFocusToParent?: VoidFunction;
  onChildFocusItemIndex: (index: number) => void;
}

interface GenericMenuOptionsProps<Option, Value> {
  options: Array<Option | UIOnlyMenuItemOption>;
  onSelect: (value: Value, optionsPath: number[], updatePosition: VoidFunction) => void;
  getOptionLabel: GetOptionLabel<Value>;
  getOptionValue: GetOptionValue<Option, Value>;
  renderOptionLabel: RenderOptionLabel<Option, Value>;
}

interface OptionalProps<Option> {
  grouped?: boolean;
  isMultiLevel?: boolean;
  getOptionKey?: GetOptionKey<Option>;
}

export interface MenuOptionsProps<Option, Value> extends BaseMenuOptionsProps, OptionalProps<Option>, GenericMenuOptionsProps<Option, Value> {
  getOptionKey: GetOptionKey<Option>;
}

export interface MenuOptionsWithIDProps<Option extends MenuItemWithID, Value>
  extends BaseMenuOptionsProps,
    OptionalProps<Option>,
    GenericMenuOptionsProps<Option, Value> {}

export interface MenuOptionsMultilevelProps<Option extends MenuItemMultilevel<Option>, Value>
  extends BaseMenuOptionsProps,
    OptionalProps<Option>,
    GenericMenuOptionsProps<Option, Value> {
  isMultiLevel: true;
  getOptionKey: GetOptionKey<Option>;
}

export interface MenuOptionsWithIDMultilevelProps<Option extends MenuItemWithID & MenuItemMultilevel<Option>, Value>
  extends BaseMenuOptionsProps,
    OptionalProps<Option>,
    GenericMenuOptionsProps<Option, Value> {
  isMultiLevel: true;
}

export interface MenuOptionsGroupedProps<Option extends MenuItemGrouped<Option>, Value>
  extends BaseMenuOptionsProps,
    OptionalProps<Option>,
    GenericMenuOptionsProps<Option, Value> {
  grouped: true;
  getOptionKey: GetOptionKey<Option>;
}

export interface MenuOptionsWithIDGroupedProps<Option extends MenuItemWithID & MenuItemGrouped<Option>, Value>
  extends BaseMenuOptionsProps,
    OptionalProps<Option>,
    GenericMenuOptionsProps<Option, Value> {
  grouped: true;
}

export interface MenuOptionsInternalProps extends BaseMenuOptionsProps, GenericMenuOptionsProps<unknown, unknown>, OptionalProps<unknown> {}
