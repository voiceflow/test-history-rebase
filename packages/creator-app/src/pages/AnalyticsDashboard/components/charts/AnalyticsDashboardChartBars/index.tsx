import { SectionV2, Switch } from '@voiceflow/ui';
import React from 'react';

import { QueryState } from '../../../constants';
import { BarChartResult, QueryResult } from '../../../types';
import AnalyticsDashboardChartEmpty from '../AnalyticsDashboardChartEmpty';
import * as S from './styles';

interface AnalyticsDashboardChartBarProps {
  query: QueryResult<Array<BarChartResult<unknown>>>;
}

const AnalyticsDashboardChartBar: React.FC<AnalyticsDashboardChartBarProps> = ({ query }) => {
  return (
    <S.Container column>
      <SectionV2.Title secondary>Bar chart.</SectionV2.Title>

      <Switch active={query.state}>
        <Switch.Pane value={QueryState.LOADING}>
          <SectionV2.Title secondary>Loading...</SectionV2.Title>
        </Switch.Pane>

        <Switch.Pane value={QueryState.ERROR}>
          <SectionV2.Title secondary>Error loading data.</SectionV2.Title>
        </Switch.Pane>

        <Switch.Pane value={QueryState.SUCCESS}>
          {query.data ? (
            <SectionV2.Description secondary>{JSON.stringify(query.data, null, 2)}</SectionV2.Description>
          ) : (
            <AnalyticsDashboardChartEmpty query={query} />
          )}
        </Switch.Pane>
      </Switch>
    </S.Container>
  );
};

export default AnalyticsDashboardChartBar;
