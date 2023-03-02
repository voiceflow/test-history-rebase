import { PeriodFilterOption } from './constants';

const PERIOD_TO_WIDTH: Readonly<Record<PeriodFilterOption, number>> = {
  [PeriodFilterOption.LAST_7_DAYS]: 192,
  [PeriodFilterOption.LAST_30_DAYS]: 200,
  [PeriodFilterOption.LAST_60_DAYS]: 200,
  [PeriodFilterOption.LAST_12_MONTHS]: 222,
  [PeriodFilterOption.LAST_CALENDAR_WEEK]: 248,
  [PeriodFilterOption.LAST_CALENDAR_MONTH]: 258,
};

export const getWidthForPeriodFilter = (period: PeriodFilterOption): `${number}px` => {
  return `${PERIOD_TO_WIDTH[period]}px`;
};
