import _isFunction from 'lodash/isFunction';
import _toLower from 'lodash/toLower';
import React from 'react';
import { AutoSizer, List, WindowScroller } from 'react-virtualized';

import CustomScrollbars, { Scrollbars } from '@/components/CustomScrollbars';

import { Container, ScrollContainer, SearchContainer, SearchInput, WindowScrollerContainer } from './components';

export { ItemContainer as SearchableListItemContainer } from './components';

export type SearchableListProps = {
  items: any[];
  getLabel: (item: any) => string;
  onChange?: (value: string, items: any[]) => void;
  rowHeight?: number;
  renderItem: (item: any, index: number) => React.ReactNode;
  placeholder: string;
  formatValue?: (value: string) => string;
};

const SearchableList: React.FC<SearchableListProps> = (
  { items, getLabel, onChange, rowHeight = 42, renderItem, placeholder, formatValue = (value) => value },
  ref: React.Ref<Scrollbars>
) => {
  const [scrollbars, setCustomScrollBars] = React.useState<Scrollbars | null>(null);
  const [searchValue, setSearchValue] = React.useState('');

  const filteredItems = React.useMemo(() => {
    const lowerCasedSearchValue = _toLower(searchValue).trim();

    return items.filter((item) => _toLower(getLabel(item)).includes(lowerCasedSearchValue));
  }, [items, getLabel, searchValue]);

  const rowRenderer = ({ key, index, style }: { key: string; index: number; style: object }) => (
    <div key={key} style={style}>
      {renderItem(filteredItems[index], index)}
    </div>
  );

  const onRef = React.useCallback(
    (scrls: Scrollbars) => {
      if (ref) {
        if (_isFunction(ref)) {
          ref(scrls);
        } else {
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          ref.current = scrls;
        }
      }

      setCustomScrollBars(scrls);
    },
    [ref]
  );

  const onChangeValue = React.useCallback(
    ({ currentTarget }: React.KeyboardEvent<HTMLInputElement>) => {
      const value = formatValue(currentTarget.value);

      setSearchValue(value);
    },
    [onChange]
  );

  React.useEffect(() => {
    onChange?.(searchValue, filteredItems);
  }, [filteredItems]);

  return (
    <Container>
      <ScrollContainer>
        <CustomScrollbars ref={onRef}>
          {!scrollbars ? null : (
            <WindowScrollerContainer>
              <WindowScroller scrollElement={scrollbars.view}>
                {({ height, isScrolling, registerChild, scrollTop }) =>
                  !!height && (
                    <AutoSizer disableHeight={true}>
                      {({ width }) => (
                        <div ref={registerChild}>
                          <List
                            width={width}
                            height={height}
                            scrollTop={scrollTop}
                            rowCount={filteredItems.length}
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
        </CustomScrollbars>
      </ScrollContainer>

      <SearchContainer>
        <SearchInput icon="search" value={searchValue} onChange={onChangeValue} iconProps={{ color: '#8da2b5' }} placeholder={placeholder} />
      </SearchContainer>
    </Container>
  );
};

export default React.forwardRef(SearchableList);
