import composeRef from '@seznam/compose-react-refs';
import React from 'react';
import { AutoSizer, List, WindowScroller } from 'react-virtualized';

import CustomScrollbars, { Scrollbars } from '@/components/CustomScrollbars';
import { ScrollContextProvider } from '@/contexts';
import { useScrollHelpers } from '@/hooks';

import { WindowScrollerContainer } from './components';

export interface VirtualListProps {
  id?: string;
  size: number;
  header?: React.ReactNode;
  rowHeight?: number;
  renderItem: (index: number) => React.ReactNode;
}

const VirtualList: React.ForwardRefRenderFunction<Scrollbars, VirtualListProps> = ({ id, size, header, rowHeight = 42, renderItem }, ref) => {
  const [scrollbars, setCustomScrollBars] = React.useState<Scrollbars | null>(null);
  const { bodyRef, scrollHelpers } = useScrollHelpers<Scrollbars>();

  const rowRenderer = ({ key, index, style }: { key: string; index: number; style: object }) => (
    <div key={key} style={style}>
      {renderItem(index)}
    </div>
  );

  return (
    <CustomScrollbars ref={composeRef<Scrollbars>(ref, bodyRef, setCustomScrollBars)}>
      <ScrollContextProvider value={scrollHelpers}>
        {header}

        {!scrollbars ? null : (
          <WindowScrollerContainer>
            <WindowScroller scrollElement={scrollbars.view}>
              {({ height, isScrolling, registerChild, scrollTop }) =>
                !!height && (
                  <AutoSizer disableHeight={true}>
                    {({ width }) => (
                      <div id={id} ref={registerChild}>
                        <List
                          width={width}
                          height={height}
                          rowCount={size}
                          scrollTop={scrollTop}
                          rowHeight={rowHeight}
                          autoHeight
                          rowRenderer={rowRenderer}
                          isScrolling={isScrolling}
                        />
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

export default React.forwardRef<Scrollbars, VirtualListProps>(VirtualList);
