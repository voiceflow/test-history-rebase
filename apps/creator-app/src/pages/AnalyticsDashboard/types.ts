import { DonutChartDatum } from '@voiceflow/ui';

import { PeriodFilterOption, QueryKind, QueryState } from './constants';

type TimeSeriesPoint = [time: Date, value: number];

export interface GraphResult {
  /** A percentage (`-1 <= x <= 1`) summarizing the change for this value since the last period. */
  changeSincePreviousPeriod: number;
  points: TimeSeriesPoint[];
  /** A string to display the user describing the selected time period for this data. */
  period: PeriodFilterOption;
  total: number;
}

export interface DonutChartResult {
  /** A percentage (`-1 <= x <= 1`) summarizing the change for this value since the last period. */
  changeSincePreviousPeriod: number;

  data: DonutChartDatum[];

  /** A percentage (`0 <= x <= 1`) summarizing the percentage of the total value that this data represents. */
  mainPercentage: number;
}

export interface BarChartResult<T> {
  name: T;
  value: number;
}

type InteractionsResult = GraphResult;
type RecognitionRateResult = DonutChartResult;
type UsersResult = GraphResult;
type SessionsResult = GraphResult;
type TopIntentsResult = Array<BarChartResult<string>>;

export type ResultData<T extends QueryKind> = {
  [QueryKind.INTERACTIONS]: InteractionsResult;
  [QueryKind.RECOGNITION_RATE]: RecognitionRateResult;
  [QueryKind.USERS]: UsersResult;
  [QueryKind.SESSIONS]: SessionsResult;
  [QueryKind.TOP_INTENTS]: TopIntentsResult;
}[T];

export interface Filters {
  period: PeriodFilterOption;
}

export interface DateRange {
  start: Date;
  end: Date;
}

interface BaseQuery {
  projectID: string;
  currentRange: DateRange;
  /** Whether mocked data should be used instead of real data. */
  mockData: boolean;
}

interface InteractionsQuery extends BaseQuery {
  previousRange: DateRange;
  period: PeriodFilterOption;
}
interface RecognitionRateQuery extends BaseQuery {
  previousRange: DateRange;
}
interface UsersQuery extends BaseQuery {
  previousRange: DateRange;
  period: PeriodFilterOption;
}
interface SessionsQuery extends BaseQuery {
  previousRange: DateRange;
  period: PeriodFilterOption;
}
type TopIntentsQuery = BaseQuery;

export type Query<T extends QueryKind> = {
  [QueryKind.INTERACTIONS]: InteractionsQuery;
  [QueryKind.RECOGNITION_RATE]: RecognitionRateQuery;
  [QueryKind.USERS]: UsersQuery;
  [QueryKind.SESSIONS]: SessionsQuery;
  [QueryKind.TOP_INTENTS]: TopIntentsQuery;
}[T];

export type QueryResult<T> =
  | {
      data: T | null;
      state: QueryState.SUCCESS;
    }
  | {
      data: null;
      state: QueryState.LOADING | QueryState.ERROR;
    };
