import type { Nullish } from '@voiceflow/common';
import type { TableSorterOptions } from '@voiceflow/ui-next';

import type { CMSFolder, CMSResource, CMSResourceSearchContext } from './CMSManager.interface';

export const localeCompareSort = (left: string, right: string): number => right.toLocaleLowerCase().localeCompare(left.toLocaleLowerCase());

export const updatedAtSort = <Item extends CMSResource>(left: Item | CMSFolder, right: Item | CMSFolder): number =>
  new Date(left.updatedAt).getTime() - new Date(right.updatedAt).getTime();

export const withOptionalSort =
  <Value>(sort: (left: NonNullable<Value>, right: NonNullable<Value>) => number) =>
  (left: Nullish<Value>, right: Nullish<Value>): number => {
    if (left != null && right != null) return sort(left, right);

    return left != null ? -1 : 1;
  };

export const withFieldLocaleCompareSort =
  <Field extends string>(field: Field) =>
  (left: { [key in Field]: Nullish<string> }, right: { [key in Field]: Nullish<string> }): number =>
    withOptionalSort<string>(localeCompareSort)(left[field], right[field]);

export const withFolderSort =
  <Item extends CMSResource, SortContext = unknown>(sort: (left: Item, right: Item, options: TableSorterOptions<SortContext>) => number) =>
  (left: Item | CMSFolder, right: Item | CMSFolder, options: TableSorterOptions<SortContext>): number => {
    if (left.group && right.group) return withFieldLocaleCompareSort('name')(left, right);
    if (left.group || right.group) return (left.group ? 1 : -1) * (options.descending ? 1 : -1);

    return sort(left, right, options);
  };

export const withFolderSearch =
  <Item extends CMSResource, SearchContext extends CMSResourceSearchContext = CMSResourceSearchContext>(
    search: (item: Item, context: SearchContext) => boolean
  ) =>
  (item: Item | CMSFolder, context: SearchContext): boolean => {
    if (item.group) return item.name.includes(context.search);

    return search(item, context);
  };
