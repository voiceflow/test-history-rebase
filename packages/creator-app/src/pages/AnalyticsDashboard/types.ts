import { PeriodFilterOption, QueryKind, QueryState } from './constants';

type TimeSeriesPoint = [time: Date, value: number];

export interface GraphResult {
  /** A percentage (`-1 <= x <= 1`) summarizing the change for this value since the last period. */
  changeSincePreviousPeriod: number;
  points: TimeSeriesPoint[];
}

export interface DonutChartResult<T extends string> {
  /** A percentage (`-1 <= x <= 1`) summarizing the change for this value since the last period. */
  changeSincePreviousPeriod: number;

  values: Record<T, number>;
}

export interface BarChartResult<T> {
  name: T;
  value: number;
}

type InteractionsResult = GraphResult;
type RecognitionRateResult = DonutChartResult<'recognized' | 'unrecognized'>;
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
}

interface InteractionsQuery extends BaseQuery {
  previousRange: DateRange;
}
interface RecognitionRateQuery extends BaseQuery {
  previousRange: DateRange;
}
interface UsersQuery extends BaseQuery {
  previousRange: DateRange;
}
interface SessionsQuery extends BaseQuery {
  previousRange: DateRange;
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
