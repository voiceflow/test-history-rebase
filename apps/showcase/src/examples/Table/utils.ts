import { faker } from '@faker-js/faker';
import { RankingInfo, rankItem } from '@tanstack/match-sorter-utils';
import { FilterFn } from '@tanstack/react-table';

import { TableItem } from './types';

export const createTableItems = (itemsLength: number): TableItem[] => {
  const items = [] as TableItem[];

  for (let i = 0; i < itemsLength; i++) {
    items.push({
      id: faker.database.mongodbObjectId(),
      image: faker.image.imageUrl(),
      name: faker.name.fullName(),
    });
  }

  return items;
};

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};
