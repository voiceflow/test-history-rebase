import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import { QueryState } from '../../../constants';
import type { QueryResult } from '../../../types';
import * as S from './styles';

interface AnalyticsDashboardChartEmptyProps {
  query: QueryResult<object>;
}

const AnalyticsDashboardChartEmpty: React.FC<AnalyticsDashboardChartEmptyProps> = ({ query }) => {
  if (query.state === QueryState.LOADING || query.state === QueryState.ERROR) {
    throw new RangeError('Empty chart should only be rendered when query is finished.');
  }

  return (
    <S.Container>
      <SectionV2.Title fill={false} secondary paddingX={32}>
        Report is empty because no data matches filters.
      </SectionV2.Title>
    </S.Container>
  );
};

export default AnalyticsDashboardChartEmpty;
