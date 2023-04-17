import { EmptyListText, Searchbar } from './defaultComponent';
import useSearch from './hooks';

/**
 * Implements minimal reusable searchbar functionality.
 *
 * The `useSearch` hook filters a given list of items for those that match a
 * particular search text according to user-defined criteria. The hook then outputs
 * the filtered list of items and a callback to update the search text.
 *
 * The `Searchbar` provides a default implementation of a search bar that works
 * in tandem with `useSearch`. However, any implementation of a Searchbar can be
 * integrated with `useSearch`
 */
export default Object.assign(Searchbar, {
  useSearch,
  EmptyListText,
});
