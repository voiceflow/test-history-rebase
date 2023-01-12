import { SectionV2, Switch } from '@voiceflow/ui';
import React from 'react';

import { QueryState } from '../../../constants';
import { DonutChartResult, QueryResult } from '../../../types';
import AnalyticsDashboardChartEmpty from '../AnalyticsDashboardChartEmpty';
import * as S from './styles';

interface AnalyticsDashboardChartDonutProps {
  query: QueryResult<DonutChartResult<string>>;
}

const AnalyticsDashboardChartDonut: React.FC<AnalyticsDashboardChartDonutProps> = ({ query }) => {
  return (
    <S.Container column>
      <SectionV2.Title secondary>Donut chart.</SectionV2.Title>

      <Switch active={query.state}>
        <Switch.Pane value={QueryState.LOADING}>
          <SectionV2.Title secondary>Loading...</SectionV2.Title>
        </Switch.Pane>

        <Switch.Pane value={QueryState.ERROR}>
          <SectionV2.Title secondary>Error loading data.</SectionV2.Title>
        </Switch.Pane>

        <Switch.Pane value={QueryState.SUCCESS}>
          {query.data ? (
            <>
              <SectionV2.Title secondary>{Math.round(query.data.changeSincePreviousPeriod * 100)}% change since previous period</SectionV2.Title>
              <SectionV2.Description secondary>{JSON.stringify(query.data.values, null, 2)}</SectionV2.Description>
            </>
          ) : (
            <AnalyticsDashboardChartEmpty query={query} />
          )}
        </Switch.Pane>
      </Switch>
    </S.Container>
  );
};

export default AnalyticsDashboardChartDonut;
