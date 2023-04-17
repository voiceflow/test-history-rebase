import React from 'react';

/**
 * TYPE - `SearchableItem` - The type for the elements of a list which are trying to
 * filter by a searchc criteria.
 */
interface useSearchProps<SearchableItem> {
  /**
   * The elements of the list that we are searching/filtering on.
   */
  searchItems: SearchableItem[];

  /**
   * The user-defined logic for how the `searchItems` are filtered based on the
   * `searchText`
   */
  filterPredicate: (item: SearchableItem, searchText: string) => boolean;
}

interface useSearchOutput<SearchableItem> {
  /**
   * The filtered list of `SearchableItem`s
   */
  filteredItems: SearchableItem[];

  /**
   * The current search text we are filtering under
   */
  searchText: string;

  /**
   * Used to update the `searchText` used to filter out for the desired `SearchableItem`s
   */
  setSearchText: (newSearchText: string) => void;

  /**
   * Used to clear the search text
   */
  cancelSearch: VoidFunction;
}

/**
 * Given `searchItems`, filters it by the `filterPredicate`.
 *
 * The `filterPredicate` is executed on each element of the `searchItems` using a call to
 * `.filter()` and filters each element of `searchItems` using the `searchText` it receives
 * as input.
 *
 * See `useSearchProps` for more details.
 */
const useSearch = <SearchableItem>({ searchItems, filterPredicate }: useSearchProps<SearchableItem>): useSearchOutput<SearchableItem> => {
  const [searchText, setSearchText] = React.useState('');

  const filteredItems = React.useMemo(
    () => searchItems.filter((item) => filterPredicate(item, searchText)),
    [searchItems, filterPredicate, searchText]
  );

  const cancelSearch = () => setSearchText('');

  return {
    filteredItems,
    searchText,
    setSearchText,
    cancelSearch,
  };
};

export default useSearch;
