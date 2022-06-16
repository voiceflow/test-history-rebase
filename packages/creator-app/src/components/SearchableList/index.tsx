import { CustomScrollbarsTypes, useDidUpdateEffect } from '@voiceflow/ui';
import _toLower from 'lodash/toLower';
import React from 'react';

import VirtualList, { VirtualListProps } from '@/components/VirtualList';

import { AddButton, Container, ScrollContainer, SearchContainer, SearchInput } from './components';

export { IntentName, ItemContainer as SearchableListItemContainer } from './components';

export interface SearchableListProps<T> extends Pick<VirtualListProps, 'id' | 'rowHeight'> {
  items: T[];
  onAdd?: () => void;
  getLabel: (item: T) => string;
  onChange?: (value: string, items: T[]) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  addMessage?: string;
  placeholder: string;
  formatValue?: (value: string) => string;
}

const SearchableList: React.ForwardRefRenderFunction<CustomScrollbarsTypes.Scrollbars, SearchableListProps<any>> = (
  { items, getLabel, onAdd, addMessage, onChange, rowHeight, renderItem, placeholder, formatValue = (value) => value, id },
  ref
) => {
  const [searchValue, setSearchValue] = React.useState('');

  const filteredItems = React.useMemo(() => {
    const lowerCasedSearchValue = _toLower(searchValue).trim();

    return items.filter((item) => _toLower(getLabel(item)).includes(lowerCasedSearchValue));
  }, [items, getLabel, searchValue]);

  const onChangeValue = React.useCallback(
    ({ currentTarget }: React.ChangeEvent<HTMLInputElement>) => {
      const value = formatValue(currentTarget.value);

      setSearchValue(value);
    },
    [onChange]
  );

  const renderListItem = React.useCallback((index: number) => renderItem(filteredItems[index], index), [filteredItems, renderItem]);

  useDidUpdateEffect(() => {
    onChange?.(searchValue, filteredItems);
  }, [filteredItems]);

  return (
    <Container>
      <ScrollContainer>
        <VirtualList id={id} ref={ref} size={filteredItems.length} rowHeight={rowHeight} renderItem={renderListItem} />
      </ScrollContainer>

      <SearchContainer>
        <SearchInput icon="search" value={searchValue} onChange={onChangeValue} iconProps={{ color: '#8da2b5' }} placeholder={placeholder} />
        {!!onAdd && <AddButton onClick={onAdd} message={addMessage} />}
      </SearchContainer>
    </Container>
  );
};

export default React.forwardRef(SearchableList);
