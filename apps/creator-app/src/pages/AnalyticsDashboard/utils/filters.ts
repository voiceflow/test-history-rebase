import dayjs from 'dayjs';

import { PeriodFilterOption } from '../constants';
import { DateRange, Filters } from '../types';

export const DEFAULT_FILTERS: Readonly<Filters> = {
  period: PeriodFilterOption.LAST_7_DAYS,
};

const PERIOD_TO_LABEL_MAP: Readonly<Record<PeriodFilterOption, string>> = {
  [PeriodFilterOption.LAST_7_DAYS]: 'Last 7 days',
  [PeriodFilterOption.LAST_30_DAYS]: 'Last 30 days',
  [PeriodFilterOption.LAST_60_DAYS]: 'Last 60 days',
  [PeriodFilterOption.LAST_12_MONTHS]: 'Last 12 months',
  [PeriodFilterOption.LAST_CALENDAR_WEEK]: 'Last calendar week',
  [PeriodFilterOption.LAST_CALENDAR_MONTH]: 'Last calendar month',
};

export const getLabelForPeriod = (period: PeriodFilterOption): string => {
  return PERIOD_TO_LABEL_MAP[period];
};

const PREVIOUS_PERIOD_TO_LABEL_MAP: Readonly<Record<PeriodFilterOption, string>> = {
  [PeriodFilterOption.LAST_7_DAYS]: 'previous 7 days',
  [PeriodFilterOption.LAST_30_DAYS]: 'previous 30 days',
  [PeriodFilterOption.LAST_60_DAYS]: 'previous 60 days',
  [PeriodFilterOption.LAST_12_MONTHS]: 'previous 12 months',
  [PeriodFilterOption.LAST_CALENDAR_WEEK]: 'previous calendar week',
  [PeriodFilterOption.LAST_CALENDAR_MONTH]: 'previous calendar month',
};

export const getLabelForPreviousPeriod = (previousPeriod: PeriodFilterOption): string => {
  return PREVIOUS_PERIOD_TO_LABEL_MAP[previousPeriod];
};

export const periodToDateRange = (period: PeriodFilterOption, now?: Date): DateRange => {
  const endTime = now ? dayjs(now) : dayjs().endOf('day');

  switch (period) {
    case PeriodFilterOption.LAST_7_DAYS:
      return {
        start: endTime.subtract(7, 'days').toDate(),
        end: endTime.toDate(),
      };
    case PeriodFilterOption.LAST_30_DAYS:
      return {
        start: endTime.subtract(30, 'days').toDate(),
        end: endTime.toDate(),
      };
    case PeriodFilterOption.LAST_60_DAYS:
      return {
        start: endTime.subtract(60, 'days').toDate(),
        end: endTime.toDate(),
      };
    case PeriodFilterOption.LAST_12_MONTHS:
      return {
        start: endTime.subtract(12, 'months').toDate(),
        end: endTime.toDate(),
      };

    case PeriodFilterOption.LAST_CALENDAR_WEEK:
      return {
        start: endTime.subtract(1, 'weeks').startOf('week').toDate(),
        end: endTime.subtract(1, 'weeks').endOf('week').toDate(),
      };
    case PeriodFilterOption.LAST_CALENDAR_MONTH:
      return {
        start: endTime.subtract(1, 'months').startOf('month').toDate(),
        end: endTime.subtract(1, 'months').endOf('month').toDate(),
      };

    default:
      throw new RangeError(`Period ${String(period)} is not recognized`);
  }
};
