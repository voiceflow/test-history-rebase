import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { useAsyncEffect, useContextApi, useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';

import { Path } from '@/config/routes';
import * as ProjectV2 from '@/ducks/projectV2';
import { useFeature, useSelector } from '@/hooks';

import { QueryKind, QueryState } from '../constants';
import type { Filters, QueryResult, ResultData } from '../types';
import { DEFAULT_FILTERS, periodToDateRange, Queries } from '../utils';

interface AnalyticsDashboardContextValue {
  /** Set the query filters. */
  setFilters: (filters: Partial<Readonly<Filters>>) => void;
  /** Query filters. */
  filters: Filters;

  interactions: QueryResult<ResultData<QueryKind.INTERACTIONS>>;
  recognitionRate: QueryResult<ResultData<QueryKind.RECOGNITION_RATE>>;
  users: QueryResult<ResultData<QueryKind.USERS>>;
  sessions: QueryResult<ResultData<QueryKind.SESSIONS>>;
  topIntents: QueryResult<ResultData<QueryKind.TOP_INTENTS>>;

  /** Whether there are any in-progress queries for analytics. */
  isLoaded: boolean;
  /** Trigger a refresh of the dashboard. */
  refresh: VoidFunction;
}

const INITIAL_STATE: AnalyticsDashboardContextValue = {
  setFilters: Utils.functional.noop,
  filters: DEFAULT_FILTERS,

  interactions: {
    data: null,
    state: QueryState.LOADING,
  },
  recognitionRate: {
    data: null,
    state: QueryState.LOADING,
  },
  users: {
    data: null,
    state: QueryState.LOADING,
  },
  sessions: {
    data: null,
    state: QueryState.LOADING,
  },
  topIntents: {
    data: null,
    state: QueryState.LOADING,
  },

  isLoaded: false,
  refresh: Utils.functional.noop,
};

const dataField = <T extends QueryKind>(kind: T): `${T}_DATA` => `${kind}_DATA`;
const stateField = <T extends QueryKind>(kind: T): `${T}_STATE` => `${kind}_STATE`;

export const AnalyticsDashboardContext = React.createContext<AnalyticsDashboardContextValue>(INITIAL_STATE);

export const AnalyticsDashboardProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const isActive = !!useRouteMatch(Path.PROJECT_ANALYTICS);

  const projectID = useSelector(ProjectV2.active.idSelector);

  const [state, stateAPI] = useSmartReducerV2({
    filters: DEFAULT_FILTERS,
    refreshedAt: Date.now(),
    [dataField(QueryKind.USERS)]: INITIAL_STATE.users.data,
    [stateField(QueryKind.USERS)]: INITIAL_STATE.users.state,

    [dataField(QueryKind.SESSIONS)]: INITIAL_STATE.sessions.data,
    [stateField(QueryKind.SESSIONS)]: INITIAL_STATE.sessions.state,

    [dataField(QueryKind.TOP_INTENTS)]: INITIAL_STATE.topIntents.data,
    [stateField(QueryKind.TOP_INTENTS)]: INITIAL_STATE.topIntents.state,

    [dataField(QueryKind.INTERACTIONS)]: INITIAL_STATE.interactions.data,
    [stateField(QueryKind.INTERACTIONS)]: INITIAL_STATE.interactions.state,

    [dataField(QueryKind.RECOGNITION_RATE)]: INITIAL_STATE.recognitionRate.data,
    [stateField(QueryKind.RECOGNITION_RATE)]: INITIAL_STATE.recognitionRate.state,
  });

  const { currentRange, previousRange } = React.useMemo(() => {
    const currentRange = periodToDateRange(state.filters.period);

    return {
      currentRange,
      previousRange: periodToDateRange(state.filters.period, currentRange.start),
    };
  }, [state.filters.period]);

  const mockData = useFeature(Realtime.FeatureFlag.ANALYTICS_DASHBOARD_MOCK_DATA).isEnabled;

  useAsyncEffect(async () => {
    if (!isActive || !projectID) {
      stateAPI.reset();
      return;
    }

    const queries: Record<QueryKind, () => Promise<void>> = {
      [QueryKind.INTERACTIONS]: async () =>
        stateAPI[dataField(QueryKind.INTERACTIONS)].set(
          await Queries.fetchInteractions({
            projectID,
            currentRange,
            previousRange,
            period: state.filters.period,
            mockData,
          })
        ),

      [QueryKind.RECOGNITION_RATE]: async () =>
        stateAPI[dataField(QueryKind.RECOGNITION_RATE)].set(
          await Queries.fetchRecognitionRate({ projectID, currentRange, previousRange, mockData })
        ),

      [QueryKind.USERS]: async () =>
        stateAPI[dataField(QueryKind.USERS)].set(
          await Queries.fetchUsers({ projectID, currentRange, previousRange, period: state.filters.period, mockData })
        ),

      [QueryKind.SESSIONS]: async () =>
        stateAPI[dataField(QueryKind.SESSIONS)].set(
          await Queries.fetchSessions({
            projectID,
            currentRange,
            previousRange,
            period: state.filters.period,
            mockData,
          })
        ),

      [QueryKind.TOP_INTENTS]: async () =>
        stateAPI[dataField(QueryKind.TOP_INTENTS)].set(
          await Queries.fetchTopIntents({ projectID, currentRange, mockData })
        ),
    };

    await Promise.all(
      Utils.object.getKeys(queries).map(async (queryKind) => {
        stateAPI[dataField(queryKind)].set(null);
        stateAPI[stateField(queryKind)].set(QueryState.LOADING);
        try {
          await queries[queryKind]();

          stateAPI[stateField(queryKind)].set(QueryState.SUCCESS);
        } catch {
          stateAPI[stateField(queryKind)].set(QueryState.ERROR);
        }
      })
    );
  }, [state.filters, projectID, state.refreshedAt, isActive]);

  const queryKindStates = Object.values(QueryKind).map((kind) => state[stateField(kind)]);
  const isLoaded = React.useMemo(() => queryKindStates.every((state) => state !== QueryState.LOADING), queryKindStates);

  const refresh = React.useCallback(() => {
    stateAPI.refreshedAt.set(Date.now());
  }, []);

  const setFilters = React.useCallback((filters: Partial<Readonly<Filters>>) => {
    stateAPI.filters.update(filters);
  }, []);

  const getResult = React.useCallback(
    <T extends QueryKind>(kind: T): QueryResult<ResultData<T>> => {
      return {
        data: state[dataField(kind)],
        state: state[stateField(kind)],
      } as QueryResult<ResultData<typeof kind>>;
    },
    [state]
  );

  const api = useContextApi<AnalyticsDashboardContextValue>({
    setFilters,
    filters: state.filters,

    interactions: getResult(QueryKind.INTERACTIONS),
    recognitionRate: getResult(QueryKind.RECOGNITION_RATE),
    users: getResult(QueryKind.USERS),
    sessions: getResult(QueryKind.SESSIONS),
    topIntents: getResult(QueryKind.TOP_INTENTS),

    isLoaded,
    refresh,
  });

  return <AnalyticsDashboardContext.Provider value={api}>{children}</AnalyticsDashboardContext.Provider>;
};
