import dayjs from 'dayjs';

import type { PeriodFilterOption } from '../constants';
import { DONUT_CHART_COLORS } from '../constants';
import type { BarChartResult, DateRange, GraphResult } from '../types';
import type * as Queries from './queries';

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const ERROR_CHANCE = 0.05;
const NO_DATA_CHANCE = 0.15;

const mockQueryExecution = async (numberOfDays: number): Promise<void> => {
  if (Math.random() < ERROR_CHANCE) {
    await sleep(Math.floor(Math.random() * 1000) + 1000);
    throw new Error('Random error');
  }

  // Sleep for 1-2 seconds per 7 days
  const sleepTime = Math.floor(Math.random() * 1000) + 1000 * (numberOfDays / 7);
  await sleep(Math.min(sleepTime, 30000));
};

const getNumberOfDays = (range: DateRange): number => {
  return dayjs(range.end).diff(dayjs(range.start), 'day');
};

const mockTimeSeriesData = (period: PeriodFilterOption, range: DateRange): GraphResult | null => {
  if (Math.random() < NO_DATA_CHANCE) {
    return null;
  }

  const numberOfDays = getNumberOfDays(range);

  const data = Array.from({ length: numberOfDays }).map<[Date, number]>((_, i) => {
    const date = dayjs(range.start).add(i, 'day');
    return [date.toDate(), Math.floor(Math.random() * 300) + 600];
  });

  return {
    points: data,
    total: data.reduce((acc, [, value]) => acc + value, 0),
    period,
    changeSincePreviousPeriod: Math.random() - 0.5,
  };
};

const mockBarChartData = (labels: readonly string[]): Array<BarChartResult<string>> | null => {
  if (Math.random() < NO_DATA_CHANCE) {
    return null;
  }

  const data = labels.map((label) => ({
    name: label,
    value: Math.floor(Math.random() * 1000) + 750,
  }));

  data.sort((a, b) => b.value - a.value);

  return data;
};

export const fetchInteractions: typeof Queries.fetchInteractions = async ({ currentRange, period }) => {
  await mockQueryExecution(getNumberOfDays(currentRange));
  return mockTimeSeriesData(period, currentRange);
};

export const fetchRecognitionRate: typeof Queries.fetchRecognitionRate = async ({ currentRange }) => {
  await mockQueryExecution(getNumberOfDays(currentRange));

  const mainPercentage = Math.max(Math.random(), 0.65 + Math.random() * 0.1);
  const amount = Math.floor(Math.random() * 1000) + 750;
  const secondaryPercentage = 1 - mainPercentage;

  return {
    changeSincePreviousPeriod: Math.random() - 0.5,
    mainPercentage: Math.ceil(mainPercentage * 100 * 100) / 100 / 100,
    data: [
      {
        label: 'Recognized',
        value: Math.round(amount * mainPercentage),
        percentage: Math.ceil(mainPercentage * 100 * 100) / 100 / 100,
        color: DONUT_CHART_COLORS.GOOD,
      },
      {
        label: 'Not understood',
        value: Math.round(amount * secondaryPercentage),
        percentage: Math.floor(secondaryPercentage * 100 * 100) / 100 / 100,
        color: DONUT_CHART_COLORS.BAD,
      },
    ],
  };
};

export const fetchUsers: typeof Queries.fetchUsers = async ({ currentRange, period }) => {
  await mockQueryExecution(getNumberOfDays(currentRange));
  return mockTimeSeriesData(period, currentRange);
};

export const fetchSessions: typeof Queries.fetchSessions = async ({ currentRange, period }) => {
  await mockQueryExecution(getNumberOfDays(currentRange));
  return mockTimeSeriesData(period, currentRange);
};

export const fetchTopIntents: typeof Queries.fetchTopIntents = async ({ currentRange }) => {
  await mockQueryExecution(getNumberOfDays(currentRange));
  return mockBarChartData(['Book a Consultation', 'General Banking', 'Talk to Agent', 'Lost Card', 'Transfer Funds']);
};
