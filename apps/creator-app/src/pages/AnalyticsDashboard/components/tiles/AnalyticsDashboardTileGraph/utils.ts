import { AreaChart } from '@voiceflow/ui';

import { PeriodFilterOption } from '../../../constants';
import type { GraphResult } from '../../../types';

type AreaChartFormatter = typeof AreaChart.MonthlyDateFormatter;

const PERIOD_TO_AREA_CHART_FORMATTER: Record<PeriodFilterOption, AreaChartFormatter> = {
  [PeriodFilterOption.LAST_7_DAYS]: AreaChart.WeeklyDateFormatter,
  [PeriodFilterOption.LAST_30_DAYS]: AreaChart.MonthlyDateFormatter,
  [PeriodFilterOption.LAST_60_DAYS]: AreaChart.MonthlyDateFormatter,
  [PeriodFilterOption.LAST_12_MONTHS]: AreaChart.YearlyDateFormatter,

  [PeriodFilterOption.LAST_CALENDAR_WEEK]: AreaChart.WeeklyDateFormatter,
  [PeriodFilterOption.LAST_CALENDAR_MONTH]: AreaChart.MonthlyDateFormatter,
};

export const periodToAreaChartFormatter = (period: PeriodFilterOption): AreaChartFormatter => {
  return PERIOD_TO_AREA_CHART_FORMATTER[period];
};

export const getDeltaLabelColor = (data: GraphResult): string | undefined => {
  if (data.changeSincePreviousPeriod) {
    return data.changeSincePreviousPeriod > 0 ? '#38751F' : '#BD425F';
  }

  return undefined;
};

export const getGraphColor = (data: GraphResult): string | undefined => {
  if (data.changeSincePreviousPeriod) {
    return data.changeSincePreviousPeriod > 0 ? '#56B365' : '#CF4767';
  }

  return undefined;
};
