import { UsageQueryKind } from '@voiceflow/schema-types';
import dayjs from 'dayjs';

import client from '@/client';

import { DONUT_CHART_COLORS, QueryKind } from '../constants';
import { Query, ResultData } from '../types';
import * as MockQueries from './mock-queries';

/** Base filters applied to all queries. */
const BASE_FILTERS = {
  platform: {
    not: 'canvas-prototype',
  },
} as const;

type QueryUsage<T extends UsageQueryKind> = [T, T, ...T[]];

export const fetchInteractions = async ({
  projectID,
  currentRange,
  previousRange,
  period,
  mockData,
}: Query<QueryKind.INTERACTIONS>): Promise<ResultData<QueryKind.INTERACTIONS> | null> => {
  if (mockData) {
    return MockQueries.fetchInteractions({ projectID, currentRange, previousRange, period, mockData });
  }

  const days = dayjs(currentRange.end).diff(dayjs(currentRange.start), 'day');

  const [previous, current, ...allCurrent] = await client.usageAnalytics.queryUsage<QueryUsage<UsageQueryKind.INTERACTIONS>>([
    {
      name: UsageQueryKind.INTERACTIONS,
      filter: {
        ...BASE_FILTERS,
        projectID,
        startTime: previousRange.start,
        endTime: previousRange.end,
      },
    },
    {
      name: UsageQueryKind.INTERACTIONS,
      filter: {
        ...BASE_FILTERS,
        projectID,
        startTime: currentRange.start,
        endTime: currentRange.end,
      },
    },
    ...Array.from({ length: days }).map((_, i) => {
      const startTimeForDay = dayjs(currentRange.start).add(i, 'day');
      const endTimeForDay = startTimeForDay.add(1, 'day');

      return {
        name: UsageQueryKind.INTERACTIONS as const,
        filter: {
          ...BASE_FILTERS,
          projectID,
          startTime: startTimeForDay.toDate(),
          endTime: endTimeForDay.toDate(),
        },
      };
    }),
  ]);

  if (current.count === 0) {
    return null;
  }

  const changeSincePreviousPeriod = (current.count - previous.count) / previous.count;

  return {
    changeSincePreviousPeriod: Number.isFinite(changeSincePreviousPeriod) ? changeSincePreviousPeriod : 0,
    points: allCurrent.map(({ count }, i) => [dayjs(currentRange.start).add(i, 'day').toDate(), count]),
    period,
    total: current.count,
  };
};

export const fetchUsers = async ({
  projectID,
  currentRange,
  previousRange,
  period,
  mockData,
}: Query<QueryKind.USERS>): Promise<ResultData<QueryKind.USERS> | null> => {
  if (mockData) {
    return MockQueries.fetchUsers({ projectID, currentRange, previousRange, period, mockData });
  }

  const days = dayjs(currentRange.end).diff(dayjs(currentRange.start), 'day');

  const [previous, current, ...allCurrent] = await client.usageAnalytics.queryUsage<QueryUsage<UsageQueryKind.UNIQUE_USERS>>([
    {
      name: UsageQueryKind.UNIQUE_USERS,
      filter: {
        ...BASE_FILTERS,
        projectID,
        startTime: previousRange.start,
        endTime: previousRange.end,
      },
    },
    {
      name: UsageQueryKind.UNIQUE_USERS,
      filter: {
        projectID,
        ...BASE_FILTERS,
        startTime: currentRange.start,
        endTime: currentRange.end,
      },
    },
    ...Array.from({ length: days }).map((_, i) => {
      const startTimeForDay = dayjs(currentRange.start).add(i, 'day');
      const endTimeForDay = startTimeForDay.add(1, 'day');

      return {
        name: UsageQueryKind.UNIQUE_USERS as const,
        filter: {
          ...BASE_FILTERS,
          projectID,
          startTime: startTimeForDay.toDate(),
          endTime: endTimeForDay.toDate(),
        },
      };
    }),
  ]);

  if (current.count === 0) {
    return null;
  }

  const changeSincePreviousPeriod = (current.count - previous.count) / previous.count;

  return {
    changeSincePreviousPeriod: Number.isFinite(changeSincePreviousPeriod) ? changeSincePreviousPeriod : 0,
    points: allCurrent.map(({ count }, i) => [dayjs(currentRange.start).add(i, 'day').toDate(), count]),
    period,
    total: current.count,
  };
};

export const fetchRecognitionRate = async ({
  projectID,
  currentRange,
  previousRange,
  mockData,
}: Query<QueryKind.RECOGNITION_RATE>): Promise<ResultData<QueryKind.RECOGNITION_RATE> | null> => {
  if (mockData) {
    return MockQueries.fetchRecognitionRate({ projectID, currentRange, previousRange, mockData });
  }

  const [current, previous] = await client.usageAnalytics.queryUsage<QueryUsage<UsageQueryKind.UNDERSTOOD_MESSAGES>>([
    {
      name: UsageQueryKind.UNDERSTOOD_MESSAGES,
      filter: {
        ...BASE_FILTERS,
        projectID,
        startTime: currentRange.start,
        endTime: currentRange.end,
      },
    },
    {
      name: UsageQueryKind.UNDERSTOOD_MESSAGES,
      filter: {
        ...BASE_FILTERS,
        projectID,
        startTime: previousRange.start,
        endTime: previousRange.end,
      },
    },
  ]);

  if (current.total.count === 0 && current.missed.count === 0) {
    return null;
  }

  const currentRecognized = current.total.count - current.missed.count;
  const previousRecognized = previous.total.count - previous.missed.count;

  const changeSincePreviousPeriod = (currentRecognized - previousRecognized) / previousRecognized;
  return {
    data: [
      {
        label: 'Recognized',
        // Two decimal places of precision, and ensure that the sum is exactly 100%
        value: currentRecognized,
        percentage: Math.ceil((currentRecognized / current.total.count) * 100) / 100,
        color: DONUT_CHART_COLORS.GOOD,
      },
      {
        label: 'Unrecognized',
        value: current.missed.count,
        percentage: Math.ceil((current.missed.count / current.total.count) * 100) / 100,
        color: DONUT_CHART_COLORS.BAD,
      },
    ],
    mainPercentage: Math.ceil((currentRecognized / current.total.count) * 100) / 100,
    changeSincePreviousPeriod: Number.isFinite(changeSincePreviousPeriod) ? changeSincePreviousPeriod : 0,
  };
};

export const fetchSessions = async ({
  projectID,
  currentRange,
  previousRange,
  period,
  mockData,
}: Query<QueryKind.SESSIONS>): Promise<ResultData<QueryKind.SESSIONS> | null> => {
  if (mockData) {
    return MockQueries.fetchSessions({ projectID, currentRange, previousRange, period, mockData });
  }

  const days = dayjs(currentRange.end).diff(dayjs(currentRange.start), 'day');

  const [previous, current, ...allCurrent] = await client.usageAnalytics.queryUsage<QueryUsage<UsageQueryKind.SESSIONS>>([
    {
      name: UsageQueryKind.SESSIONS,
      filter: {
        ...BASE_FILTERS,
        projectID,
        startTime: previousRange.start,
        endTime: previousRange.end,
      },
    },
    {
      name: UsageQueryKind.SESSIONS,
      filter: {
        ...BASE_FILTERS,
        projectID,
        startTime: currentRange.start,
        endTime: currentRange.end,
      },
    },
    ...Array.from({ length: days }).map((_, i) => {
      const startTimeForDay = dayjs(currentRange.start).add(i, 'day');
      const endTimeForDay = startTimeForDay.add(1, 'day');

      return {
        name: UsageQueryKind.SESSIONS as const,
        filter: {
          ...BASE_FILTERS,
          projectID,
          startTime: startTimeForDay.toDate(),
          endTime: endTimeForDay.toDate(),
        },
      };
    }),
  ]);

  if (current.count === 0) {
    return null;
  }

  const changeSincePreviousPeriod = (current.count - previous.count) / previous.count;

  return {
    changeSincePreviousPeriod: Number.isFinite(changeSincePreviousPeriod) ? changeSincePreviousPeriod : 0,
    points: allCurrent.map(({ count }, i) => [dayjs(currentRange.start).add(i, 'day').toDate(), count]),
    period,
    total: current.count,
  };
};

export const fetchTopIntents = async ({
  projectID,
  currentRange,
  mockData,
}: Query<QueryKind.TOP_INTENTS>): Promise<ResultData<QueryKind.TOP_INTENTS> | null> => {
  if (mockData) {
    return MockQueries.fetchTopIntents({ projectID, currentRange, mockData });
  }

  const [current] = await client.usageAnalytics.queryUsage<[UsageQueryKind.TOP_INTENTS]>([
    {
      name: UsageQueryKind.TOP_INTENTS,
      filter: {
        ...BASE_FILTERS,
        projectID,
        startTime: currentRange.start,
        endTime: currentRange.end,
        limit: 5,
      },
    },
  ]);

  if (current.intents.length === 0) {
    return null;
  }

  return current.intents.map((intent) => ({ name: intent.name, value: intent.count }));
};
