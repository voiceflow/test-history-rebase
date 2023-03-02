import { Select } from '@voiceflow/ui';
import React from 'react';

import { PeriodFilterOption } from '../../constants';
import { AnalyticsDashboardContext } from '../../context';
import { getLabelForPeriod } from '../../utils/filters';
import * as S from './styles';
import { getWidthForPeriodFilter } from './utils';

const AnalyticsDashboardFiltersHeader: React.FC = () => {
  const analyticsDashboard = React.useContext(AnalyticsDashboardContext);

  return (
    <S.Container px={32} py={16}>
      <Select
        prefix="PERIOD"
        value={analyticsDashboard.filters.period}
        options={Object.values(PeriodFilterOption)}
        width={getWidthForPeriodFilter(analyticsDashboard.filters.period)}
        onSelect={(id) => analyticsDashboard.setFilters({ period: id })}
        getOptionLabel={(value) => value && getLabelForPeriod(value)}
      />
    </S.Container>
  );
};

export default AnalyticsDashboardFiltersHeader;
