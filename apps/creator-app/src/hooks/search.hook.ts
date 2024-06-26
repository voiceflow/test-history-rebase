import { useMemo } from 'react';

import { useDeferredState } from './state.hook';

export const useDeferredSearch = <T>({
  items,
  searchBy,
  initialValue = '',
}: {
  items: T[];
  searchBy: (item: T) => string;
  initialValue?: string;
}) => {
  const [value, deferredValue, setValue] = useDeferredState(initialValue);

  const searchItems = useMemo(() => {
    const transformedSearch = deferredValue.toLocaleLowerCase().trim();

    if (!transformedSearch) return items;

    return items
      .filter((item) => searchBy(item).toLocaleLowerCase().includes(transformedSearch))
      .sort(
        (left, right) =>
          searchBy(left).toLocaleLowerCase().indexOf(transformedSearch) -
          searchBy(right).toLocaleLowerCase().indexOf(transformedSearch)
      );
  }, [items, deferredValue]);

  return {
    value,
    items: searchItems,
    hasItems: !!searchItems?.length,
    setValue,
    deferredValue,
  };
};
