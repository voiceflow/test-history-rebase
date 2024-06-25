import type { TippyTooltipProps } from '@ui/components/TippyTooltip';
import type React from 'react';

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
  hideLastDivider?: boolean;
}

export interface ColumnSorter<I extends Item> {
  (itemL: I, itemR: I): number;
}

export interface Column<T extends string, I extends Item> {
  type: T;
  flex: number;
  label: React.ReactNode;
  width?: number;
  sorter?: ColumnSorter<I>;
  tooltip?: TippyTooltipProps;
  overflow?: boolean;
  ellipses?: boolean;
  component: React.ComponentType<ItemProps<I>>;
  overflowTooltip?: (props: ItemProps<I>) => TippyTooltipProps;
}

export interface ConfigurableRowProps<I extends Item> extends ItemProps<I>, RowProviderChildrenProps {}

export interface ConfigurableProps<T extends string, I extends Item> {
  items: I[];
  empty: React.ReactNode;
  columns: Column<T, I>[];
  orderBy?: T | null;
  renderRow?: (props: React.PropsWithChildren<ConfigurableRowProps<I>>) => React.ReactNode;
  descending?: boolean;
  onChangeOrderBy?: (orderBy: T) => void;
  scrolled?: boolean;
  stickyHeader?: boolean;
  hideLastDivider?: boolean;
  header?: React.ReactNode;
}

export interface ContextValue<T extends Item> {
  items: T[];
}

export interface RowContextValue<I extends Item> extends ItemProps<I> {
  hovered: boolean;
}

export interface RowProviderChildrenProps {
  hovered: boolean;
  onMouseEnter: VoidFunction;
  onMouseLeave: VoidFunction;
}

export interface RowProviderProps extends Omit<RowContextValue<any>, 'hovered'> {
  children: (props: RowProviderChildrenProps) => React.ReactNode;
}
