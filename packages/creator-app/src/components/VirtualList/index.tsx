import composeRef from '@seznam/compose-react-refs';
import React from 'react';
import { AutoSizer, Index, List, WindowScroller } from 'react-virtualized';

import CustomScrollbars, { Scrollbars } from '@/components/CustomScrollbars';
import { ScrollContextProvider } from '@/contexts';
import { useScrollHelpers } from '@/hooks';

import { WindowScrollerContainer } from './components';

export interface VirtualListProps {
  id?: string;
  size: number;
  header?: React.ReactNode;
  listRef?: React.Ref<List>;
  rowHeight?: number | ((index: Index) => number);
  listStyle?: React.CSSProperties;
  className?: string;
  renderItem: (index: number) => React.ReactNode;
  renderPlaceholder?: (props: { width: number; height: number }) => React.ReactNode;
}

const VirtualList: React.ForwardRefRenderFunction<Scrollbars, VirtualListProps> = (
  { id, size, header, listRef, className, rowHeight = 42, listStyle, renderItem, renderPlaceholder },
  ref
) => {
  const [scrollbars, setCustomScrollBars] = React.useState<Scrollbars | null>(null);
  const { bodyRef, scrollHelpers } = useScrollHelpers<Scrollbars>();

  const rowRenderer = React.useCallback(
    ({ key, index, style }: { key: string; index: number; style: object }) => (
      <div key={key} style={style}>
        {renderItem(index)}
      </div>
    ),
    [renderItem]
  );

  return (
    <CustomScrollbars ref={composeRef<Scrollbars>(ref, bodyRef, setCustomScrollBars)}>
      <ScrollContextProvider value={scrollHelpers}>
        {header}

        {!scrollbars ? null : (
          <WindowScrollerContainer className={className}>
            <WindowScroller scrollElement={scrollbars.view}>
              {({ height, isScrolling, registerChild, scrollTop }) =>
                !!height && (
                  <AutoSizer disableHeight={true}>
                    {({ width }) => (
                      <div id={id} ref={registerChild}>
                        {!size && renderPlaceholder ? (
                          renderPlaceholder({ width, height })
                        ) : (
                          <List
                            ref={listRef}
                            width={width}
                            style={listStyle}
                            height={height}
                            rowCount={size}
                            scrollTop={scrollTop}
                            rowHeight={rowHeight}
                            autoHeight
                            rowRenderer={rowRenderer}
                            isScrolling={isScrolling}
                          />
                        )}
                      </div>
                    )}
                  </AutoSizer>
                )
              }
            </WindowScroller>
          </WindowScrollerContainer>
        )}
      </ScrollContextProvider>
    </CustomScrollbars>
  );
};

export default React.memo(React.forwardRef<Scrollbars, VirtualListProps>(VirtualList));
