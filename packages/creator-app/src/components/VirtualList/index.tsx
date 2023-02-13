import { Box, CustomScrollbarsTypes } from '@voiceflow/ui';
import React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { ListChildComponentProps, ListItemKeySelector, VariableSizeList } from 'react-window';

import { CustomScrollbars } from './components';
import { PlaceholderRenderer, ScrollBarContextProvider } from './context';

export interface VirtualListProps<T> {
  id?: string;
  size: number;
  header?: React.ReactNode;
  itemSize: (index: number) => number;
  listData: T;
  itemKey?: ListItemKeySelector<T>;
  listStyle?: React.CSSProperties;
  className?: string;
  adjustHeight?: number;
  scrollbarsRef?: React.Ref<CustomScrollbarsTypes.Scrollbars>;
  itemComponent: React.ComponentType<ListChildComponentProps<T>>;
  renderPlaceholder?: PlaceholderRenderer;
  estimatedItemSize?: number;
}

const VirtualList = <T extends unknown>(
  {
    id,
    size,
    header,
    itemKey,
    itemSize,
    listData,
    listStyle,
    className,
    adjustHeight = 0,
    scrollbarsRef,
    itemComponent,
    renderPlaceholder,
    estimatedItemSize,
  }: VirtualListProps<T>,
  ref: React.ForwardedRef<VariableSizeList<T>>
) => (
  <ScrollBarContextProvider value={{ ref: scrollbarsRef, header, renderPlaceholder, size }}>
    <AutoSizer disableWidth>
      {({ height }) => (
        <Box id={id} width="100%" height="100%" className={className}>
          <VariableSizeList
            ref={ref}
            width="100%"
            style={listStyle}
            height={height + adjustHeight}
            itemKey={itemKey}
            itemData={listData}
            itemSize={itemSize}
            itemCount={size}
            outerElementType={CustomScrollbars}
            estimatedItemSize={estimatedItemSize}
          >
            {itemComponent}
          </VariableSizeList>
        </Box>
      )}
    </AutoSizer>
  </ScrollBarContextProvider>
);

export default React.forwardRef<VariableSizeList<any>, VirtualListProps<any>>(VirtualList) as <T>(
  props: VirtualListProps<T> & React.RefAttributes<VariableSizeList<T>>
) => JSX.Element | null;
