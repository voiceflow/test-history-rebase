import { Select } from '@voiceflow/ui';
import React from 'react';

import { PeriodFilterOption } from './constants';
import { getLabelForPeriod } from './filters';
import * as S from './styles';

interface AnalyticsDashboardFiltersHeaderProps {
  periodFilter: PeriodFilterOption;
  setPeriodFilter: (periodFilter: PeriodFilterOption) => void;
}

const AnalyticsDashboardFiltersHeader: React.OldFC<AnalyticsDashboardFiltersHeaderProps> = ({ periodFilter, setPeriodFilter }) => {
  return (
    <S.Container px={32} py={16}>
      <Select
        prefix="PERIOD"
        value={periodFilter}
        options={Object.values(PeriodFilterOption)}
        onSelect={(id) => setPeriodFilter(id!)}
        getOptionLabel={(value) => value && getLabelForPeriod(value)}
      />
    </S.Container>
  );
};

export default AnalyticsDashboardFiltersHeader;
