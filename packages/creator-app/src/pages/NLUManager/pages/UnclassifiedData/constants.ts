export enum ListOrder {
  NEWEST = 'newest',
  OLDEST = 'oldest',
}

export const LIST_ORDER_LABELS: Record<ListOrder, string> = {
  [ListOrder.NEWEST]: 'Newest',
  [ListOrder.OLDEST]: 'Oldest',
};

export const LIST_ORDER_OPTIONS = Object.values(ListOrder).map((value) => ({ value, label: LIST_ORDER_LABELS[value] }));

export const MIN_PAGINATION_ITEMS = 100;

export const CLUSTERING_THRESHOLD = 0.8;
