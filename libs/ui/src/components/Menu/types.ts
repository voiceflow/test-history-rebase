import type { SvgIconTypes } from '@ui/components/SvgIcon';
import type { Nullable } from '@voiceflow/common';
import type React from 'react';
import type { Scrollbars } from 'react-custom-scrollbars-2';

import type { ItemProps } from './components';

export type { ItemProps };

export interface BaseOption extends ItemProps {
  key?: string;
  icon?: SvgIconTypes.Icon;
  note?: React.ReactNode;
  label: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
}

export interface OptionWithValue<Value> extends BaseOption {
  value: Value;
}

export interface OptionWithoutValue extends BaseOption {
  value?: never;
}

export type Option<Value = void> = Value extends void ? OptionWithoutValue : OptionWithValue<Value>;

export interface BaseProps {
  id?: string;
  hint?: React.ReactNode;
  width?: number;
  inline?: boolean;
  onHide?: () => void;
  disabled?: boolean;
  onToggle?: () => void;
  fullWidth?: boolean;
  noMargins?: boolean;
  maxHeight?: number | string;
  placement?: string;
  searchable?: React.ReactNode;
  selfDismiss?: boolean;
  noTopPadding?: boolean;
  scrollbarsRef?: React.Ref<Scrollbars>;
  maxVisibleItems?: number;
  noBottomPadding?: boolean;
  multiSelectProps?: { buttonClick: React.MouseEventHandler; buttonLabel: React.ReactNode };
  disableAnimation?: boolean;
  fadeDownDuration?: number;
  renderFooterAction?: Nullable<(options: { close: VoidFunction }) => React.ReactNode>;
  swallowMouseDownEvent?: boolean;
}

export type OnSelect<Value = void> = Value extends void ? (value?: Value) => void : (value: Value) => void;

export interface PropsWithOptions<Value = void> extends BaseProps {
  options: Nullable<Option<Value>>[];
  onSelect?: OnSelect<Value>;
  children?: never;
}

export interface PropsWithChildren extends BaseProps {
  options?: never;
  children: React.ReactNode;
  onSelect?: never;
}

export type RefElement = HTMLUListElement;
