export enum FilterType {
  OPEN = 'open',
  RESOLVED = 'resolved',
}

export const FILTER_LABELS = {
  [FilterType.OPEN]: 'Opened threads',
  [FilterType.RESOLVED]: 'Resolved threads',
};

export const HEADER_HEIGHT = 63;
