export interface UnclassifiedDataCluster {
  id: string;
  name: string;
  utteranceIDs: string[];
}

export interface ClusteringMatch {
  intentID: string;
  intentMatchScore: number;
}

export interface DateRangeOption {
  id: DateRangeTypes;
  days: number | null;
  label: string;
}

export enum DateRangeTypes {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  LAST_7_DAYS = 'last_7_days',
  LAST_30_DAYS = 'last_30_days',
  ALL_TIME = 'all_time',
}

export interface UnclassifiedViewFilters {
  dateRange?: DateRangeTypes;
  dataSourceIDs?: string[];
}
