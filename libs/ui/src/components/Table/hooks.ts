import { Utils } from '@voiceflow/common';
import React from 'react';

import type * as T from './types';

export interface FilterOrderProps<V extends string, I extends T.Item> {
  items: I[];
  columns: T.Column<V, I>[];
  filterBy?: string[];
  isDescending?: boolean;
  initialOrderBy?: V;
  getItemFilterBy?: (item: I) => string[];
}

export const useFilterOrderItems = <T extends string, I extends T.Item>({
  items: propItems,
  columns,
  filterBy,
  isDescending = true,
  initialOrderBy,
  getItemFilterBy,
}: FilterOrderProps<T, I>) => {
  const [items, setItems] = React.useState(propItems);
  const [orderBy, setOrderBy] = React.useState<T | null>(initialOrderBy ?? null);
  const [descending, setDescending] = React.useState(isDescending);

  const columnsMap = React.useMemo(() => Utils.array.createMap(columns, (column) => column.type), [columns]);

  const onChangeOrderBy = React.useCallback(
    (type: T | null) => {
      if (type === orderBy) {
        setDescending(!descending);
      } else {
        setDescending(true);
        setOrderBy(type);
      }
    },
    [orderBy, descending]
  );

  React.useEffect(() => {
    const lowercasedFilterBy = filterBy?.map((item) => item.toLowerCase());
    const filteredItems =
      lowercasedFilterBy && getItemFilterBy
        ? propItems.filter((item) =>
            getItemFilterBy(item).every((filterByItem, index) =>
              filterByItem.toLowerCase().includes(lowercasedFilterBy[index])
            )
          )
        : propItems;

    const sorter = orderBy ? columnsMap[orderBy].sorter : null;
    const items = sorter ? [...filteredItems].sort(sorter) : [...filteredItems];

    setItems(descending ? items.reverse() : items);
  }, [propItems, filterBy, columnsMap, orderBy, descending]);

  return {
    items,
    orderBy,
    descending,
    onChangeOrderBy,
  };
};
