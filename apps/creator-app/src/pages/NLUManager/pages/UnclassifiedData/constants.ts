import { DateRangeOption, DateRangeTypes } from './types';

export enum ListOrder {
  NEWEST = 'newest',
  OLDEST = 'oldest',
}

export const LIST_ORDER_LABELS: Record<ListOrder, string> = {
  [ListOrder.NEWEST]: 'Newest',
  [ListOrder.OLDEST]: 'Oldest',
};

export const LIST_ORDER_OPTIONS = Object.values(ListOrder).map((value) => ({ value, label: LIST_ORDER_LABELS[value] }));

export const CLUSTERING_THRESHOLD = 0.8;

export const DATE_RANGE_INFO_MAP = {
  [DateRangeTypes.TODAY]: { label: 'Today', days: 0 },
  [DateRangeTypes.YESTERDAY]: { label: 'Yesterday', days: 1 },
  [DateRangeTypes.LAST_7_DAYS]: { label: 'Last 7 days', days: 7 },
  [DateRangeTypes.LAST_30_DAYS]: { label: 'Last 30 days', days: 30 },
  [DateRangeTypes.ALL_TIME]: { label: 'All time', days: null },
};

export const DateRangeOptions: DateRangeOption[] = [
  {
    id: DateRangeTypes.TODAY,
    ...DATE_RANGE_INFO_MAP[DateRangeTypes.TODAY],
  },
  {
    id: DateRangeTypes.YESTERDAY,
    ...DATE_RANGE_INFO_MAP[DateRangeTypes.YESTERDAY],
  },
  {
    id: DateRangeTypes.LAST_7_DAYS,
    ...DATE_RANGE_INFO_MAP[DateRangeTypes.LAST_7_DAYS],
  },
  {
    id: DateRangeTypes.LAST_30_DAYS,
    ...DATE_RANGE_INFO_MAP[DateRangeTypes.LAST_30_DAYS],
  },
  {
    id: DateRangeTypes.ALL_TIME,
    ...DATE_RANGE_INFO_MAP[DateRangeTypes.ALL_TIME],
  },
];
