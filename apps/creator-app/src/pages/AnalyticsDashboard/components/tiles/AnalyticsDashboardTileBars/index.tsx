import { BarChart, Box, SectionV2, Switch } from '@voiceflow/ui';
import React from 'react';

import * as Router from '@/ducks/router';
import { NLUManagerOpenedOrigin } from '@/ducks/tracking/constants';
import { useDispatch } from '@/hooks';

import { QueryState } from '../../../constants';
import { BarChartResult, QueryResult } from '../../../types';
import AnalyticsDashboardChartEmpty from '../AnalyticsDashboardTileEmpty';

interface AnalyticsDashboardChartBarProps {
  query: QueryResult<Array<BarChartResult<string>>>;
}

const Chart = ({ query }: AnalyticsDashboardChartBarProps) => {
  if (!query.data) {
    throw new TypeError('Expected query data to be defined');
  }

  const dispatchGoToNLUManager = useDispatch(Router.goToCurrentNLUManager);

  const openNLUManager = () => {
    // TODO: open specific intent?
    dispatchGoToNLUManager(NLUManagerOpenedOrigin.LEFT_NAV);
  };

  const sorted = React.useMemo(
    () =>
      query.data &&
      [...query.data]
        .sort((lhs, rhs) => rhs.value - lhs.value)
        .map(({ name, value }) => ({ label: name, primary: value, empty: 0, secondary: 0, total: value })),
    [query.data]
  );

  return (
    <Box.Flex px={32} fullWidth height={322 - 16 - 60} column>
      <BarChart data={sorted} withLabels withTooltip onClick={openNLUManager} />
    </Box.Flex>
  );
};

const AnalyticsDashboardChartBar: React.FC<AnalyticsDashboardChartBarProps> = ({ query }) => {
  return (
    <>
      <Switch active={query.state}>
        <Switch.Pane value={QueryState.LOADING}>
          <Box.FlexCenter fullWidth>
            <SectionV2.Title secondary fill={false}>
              Loading...
            </SectionV2.Title>
          </Box.FlexCenter>
        </Switch.Pane>

        <Switch.Pane value={QueryState.ERROR}>
          <Box.FlexCenter fullWidth>
            <SectionV2.Title secondary fill={false}>
              Error loading data.
            </SectionV2.Title>
          </Box.FlexCenter>
        </Switch.Pane>

        <Switch.Pane value={QueryState.SUCCESS}>{query.data ? <Chart query={query} /> : <AnalyticsDashboardChartEmpty query={query} />}</Switch.Pane>
      </Switch>
    </>
  );
};

export default AnalyticsDashboardChartBar;
