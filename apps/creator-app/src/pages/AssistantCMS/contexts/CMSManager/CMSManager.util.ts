import type { NonNullishRecord, Nullish } from '@voiceflow/common';
import type { TableSorterOptions } from '@voiceflow/ui-next';

import type { CMSFolder, CMSResource, CMSResourceSearchContext } from './CMSManager.interface';

type ItemWithNonNullishField<Item extends object, Field extends keyof Item> = Item & NonNullishRecord<Pick<Item, Field>>;

const isItemFieldNonNullish = <Item extends object, Field extends keyof Item>(
  item: Item,
  field: Field
): item is ItemWithNonNullishField<Item, Field> => item[field] != null;

export const withOptionalFieldSort =
  <Item extends object, Field extends keyof Item>(
    field: Field,
    sort: (left: ItemWithNonNullishField<Item, Field>, right: ItemWithNonNullishField<Item, Field>) => number
  ) =>
  (left: Item, right: Item): number => {
    if (isItemFieldNonNullish(left, field) && isItemFieldNonNullish(right, field)) return sort(left, right);

    return left[field] ? 1 : -1;
  };

export const withLocaleCompareSort =
  <Field extends string>(field: Field) =>
  (left: { [key in Field]: Nullish<string> }, right: { [key in Field]: Nullish<string> }): number =>
    withOptionalFieldSort<{ [key in Field]: Nullish<string> }, Field>(field, ({ [field]: left }, { [field]: right }) => right.localeCompare(left))(
      left,
      right
    );

export const updatedAtSort = <Item extends CMSResource>(left: Item | CMSFolder, right: Item | CMSFolder): number =>
  new Date(left.updatedAt).getTime() - new Date(right.updatedAt).getTime();

export const withFolderSort =
  <Item extends CMSResource, SortContext = unknown>(sort: (left: Item, right: Item, options: TableSorterOptions<SortContext>) => number) =>
  (left: Item | CMSFolder, right: Item | CMSFolder, options: TableSorterOptions<SortContext>): number => {
    if (left.group && right.group) return withLocaleCompareSort('name')(left, right);
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
