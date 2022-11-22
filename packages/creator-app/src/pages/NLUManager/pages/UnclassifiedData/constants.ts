import { UnclassifiedDataCluster } from './types';

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

// TO DO: Remove this dummy data once model integration is done
export const CLUSTER_UTTERANCE_COUNT: Record<string, number> = {
  sa0d81203871: 64,
  sa0d8122dsa03871: 32,
  sa0d8sdoa1203871: 18,
  sa0d31281203871: 16,
};

// TO DO: Remove this dummy data once model integration is done
export const UNCLASSIFIED_DATA_CLUSTERS: UnclassifiedDataCluster[] = [
  {
    id: 'sa0d81203871',
    name: '“How many days before my credit card arrives”',
    utterancesCount: CLUSTER_UTTERANCE_COUNT.sa0d81203871,
  },
  {
    id: 'sa0d8122dsa03871',
    name: '“My discover card has been stolen”',
    utterancesCount: CLUSTER_UTTERANCE_COUNT.sa0d8122dsa03871,
  },
  {
    id: 'sa0d8sdoa1203871',
    name: '“I need to know something about my latest transaction”',
    utterancesCount: CLUSTER_UTTERANCE_COUNT.sa0d8sdoa1203871,
  },
  {
    id: 'sa0d31281203871',
    name: `“What's the balance in my checkings account”`,
    utterancesCount: CLUSTER_UTTERANCE_COUNT.sa0d31281203871,
  },
];
