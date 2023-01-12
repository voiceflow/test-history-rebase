import { UsageQueryKind } from '@voiceflow/schema-types';
import dayjs from 'dayjs';

import client from '@/client';

import { QueryKind } from '../constants';
import { Query, ResultData } from '../types';

export const fetchInteractions = async ({
  projectID,
  currentRange,
  previousRange,
}: Query<QueryKind.INTERACTIONS>): Promise<ResultData<QueryKind.INTERACTIONS> | null> => {
  const days = dayjs(currentRange.end).diff(dayjs(currentRange.start), 'day');

  const [previous, ...current] = await client.usageAnalytics.queryUsage([
    {
      name: UsageQueryKind.INTERACTIONS,
      filter: {
        projectID,
        startTime: previousRange.start,
        endTime: previousRange.end,
      },
    },
    ...Array.from({ length: days }).map((_, i) => {
      const startTimeForDay = dayjs(currentRange.start).add(i, 'day');
      const endTimeForDay = startTimeForDay.add(1, 'day');

      return {
        name: UsageQueryKind.INTERACTIONS as const,
        filter: {
          projectID,
          startTime: startTimeForDay.toDate(),
          endTime: endTimeForDay.toDate(),
        },
      };
    }),
  ]);

  const totalInteractionsForCurrent = current.reduce((acc, { count }) => acc + count, 0);

  if (totalInteractionsForCurrent === 0) {
    return null;
  }

  const changeSincePreviousPeriod = (totalInteractionsForCurrent - previous.count) / previous.count;

  return {
    changeSincePreviousPeriod: Number.isFinite(changeSincePreviousPeriod) ? changeSincePreviousPeriod : 0,
    points: current.map(({ count }, i) => [dayjs(currentRange.start).add(i, 'day').toDate(), count]),
  };
};

export const fetchUsers = async ({ projectID, currentRange, previousRange }: Query<QueryKind.USERS>): Promise<ResultData<QueryKind.USERS> | null> => {
  const days = dayjs(currentRange.end).diff(dayjs(currentRange.start), 'day');

  const [previous, ...current] = await client.usageAnalytics.queryUsage([
    {
      name: UsageQueryKind.UNIQUE_USERS,
      filter: {
        projectID,
        startTime: previousRange.start,
        endTime: previousRange.end,
      },
    },
    ...Array.from({ length: days }).map((_, i) => {
      const startTimeForDay = dayjs(currentRange.start).add(i, 'day');
      const endTimeForDay = startTimeForDay.add(1, 'day');

      return {
        name: UsageQueryKind.UNIQUE_USERS as const,
        filter: {
          projectID,
          startTime: startTimeForDay.toDate(),
          endTime: endTimeForDay.toDate(),
        },
      };
    }),
  ]);

  const totalUsersForCurrent = current.reduce((acc, { count }) => acc + count, 0);

  if (totalUsersForCurrent === 0) {
    return null;
  }

  const changeSincePreviousPeriod = (totalUsersForCurrent - previous.count) / previous.count;

  return {
    changeSincePreviousPeriod: Number.isFinite(changeSincePreviousPeriod) ? changeSincePreviousPeriod : 0,
    points: current.map(({ count }, i) => [dayjs(currentRange.start).add(i, 'day').toDate(), count]),
  };
};

export const fetchRecognitionRate = async ({
  projectID,
  currentRange,
  previousRange,
}: Query<QueryKind.RECOGNITION_RATE>): Promise<ResultData<QueryKind.RECOGNITION_RATE> | null> => {
  const [current, previous] = await client.usageAnalytics.queryUsage([
    {
      name: UsageQueryKind.UNDERSTOOD_MESSAGES,
      filter: {
        projectID,
        startTime: currentRange.start,
        endTime: currentRange.end,
      },
    },
    {
      name: UsageQueryKind.UNDERSTOOD_MESSAGES,
      filter: {
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
    values: {
      recognized: currentRecognized,
      unrecognized: current.missed.count,
    },
    changeSincePreviousPeriod: Number.isFinite(changeSincePreviousPeriod) ? changeSincePreviousPeriod : 0,
  };
};

export const fetchSessions = async ({
  projectID,
  currentRange,
  previousRange,
}: Query<QueryKind.SESSIONS>): Promise<ResultData<QueryKind.SESSIONS> | null> => {
  const days = dayjs(currentRange.end).diff(dayjs(currentRange.start), 'day');

  const [previous, ...current] = await client.usageAnalytics.queryUsage([
    {
      name: UsageQueryKind.SESSIONS,
      filter: {
        projectID,
        startTime: previousRange.start,
        endTime: previousRange.end,
      },
    },
    ...Array.from({ length: days }).map((_, i) => {
      const startTimeForDay = dayjs(currentRange.start).add(i, 'day');
      const endTimeForDay = startTimeForDay.add(1, 'day');

      return {
        name: UsageQueryKind.SESSIONS as const,
        filter: {
          projectID,
          startTime: startTimeForDay.toDate(),
          endTime: endTimeForDay.toDate(),
        },
      };
    }),
  ]);

  const totalSessionsForCurrent = current.reduce((acc, { count }) => acc + count, 0);

  if (totalSessionsForCurrent === 0) {
    return null;
  }

  const changeSincePreviousPeriod = (totalSessionsForCurrent - previous.count) / previous.count;

  return {
    changeSincePreviousPeriod: Number.isFinite(changeSincePreviousPeriod) ? changeSincePreviousPeriod : 0,
    points: current.map(({ count }, i) => [dayjs(currentRange.start).add(i, 'day').toDate(), count]),
  };
};

export const fetchTopIntents = async ({
  projectID,
  currentRange,
}: Query<QueryKind.TOP_INTENTS>): Promise<ResultData<QueryKind.TOP_INTENTS> | null> => {
  const [current] = await client.usageAnalytics.queryUsage([
    {
      name: UsageQueryKind.TOP_INTENTS,
      filter: {
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
