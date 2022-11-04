import { ListOrder } from '../../constants';

export const LIST_ORDER_LABELS: Record<ListOrder, string> = {
  [ListOrder.NEWEST]: 'Newest',
  [ListOrder.OLDEST]: 'Oldest',
};

export const LIST_ORDER_OPTIONS = Object.values(ListOrder).map((value) => ({ value, label: LIST_ORDER_LABELS[value] }));
