/** Options available to be selected from the list of time periods when filtering results in the analytics dashboard. */
export enum PeriodFilterOption {
  LAST_7_DAYS = 'LAST_7_DAYS',
  LAST_30_DAYS = 'LAST_30_DAYS',
  LAST_60_DAYS = 'LAST_60_DAYS',
  // TODO(jonahsnider): Verify that big projects can handle this
  LAST_12_MONTHS = 'LAST_12_MONTHS',

  LAST_CALENDAR_WEEK = 'LAST_CALENDAR_WEEK',
  LAST_CALENDAR_MONTH = 'LAST_CALENDAR_MONTH',
}

/** The states a query can be in. */
export enum QueryState {
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

/** The queries used to populate tiles on the dashboard. */
export enum QueryKind {
  INTERACTIONS = 'INTERACTIONS',
  RECOGNITION_RATE = 'RECOGNITION_RATE',
  USERS = 'USERS',
  SESSIONS = 'SESSIONS',
  TOP_INTENTS = 'TOP_INTENTS',
}

export const DONUT_CHART_COLORS = {
  GOOD: '#5b9fd7',
  BAD: '#cf4767',
} as const;
