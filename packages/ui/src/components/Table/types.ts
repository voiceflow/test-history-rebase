import type { TippyTooltipProps } from '@ui/components/TippyTooltip';
import React from 'react';

export interface Item {
  id: string;
}

export interface ItemProps<I extends Item> {
  item: I;
  index: number;
  isLast: boolean;
  isFirst: boolean;
}

export interface Props<I extends Item> {
  items: I[];
  empty: React.ReactNode;
  header?: React.ReactNode;
  renderRow: (props: ItemProps<I>) => React.ReactNode;
}

export interface ColumnSorter<I extends Item> {
  (itemL: I, itemR: I): number;
}

export interface Column<T extends string, I extends Item> {
  type: T;
  flex: number;
  label: React.ReactNode;
  sorter?: ColumnSorter<I>;
  tooltip?: TippyTooltipProps;
  ellipses?: boolean;
  component: React.ComponentType<ItemProps<I>>;
  overflowTooltip?: (props: ItemProps<I>) => TippyTooltipProps;
}

export interface ConfigurableProps<T extends string, I extends Item> {
  items: I[];
  empty: React.ReactNode;
  columns: Column<T, I>[];
  orderBy?: T | null;
  renderRow?: (props: React.PropsWithChildren<ItemProps<I>>) => React.ReactNode;
  descending?: boolean;
  onChangeOrderBy?: (orderBy: T) => void;
}

export interface ContextValue<T extends Item> {
  items: T[];
}
