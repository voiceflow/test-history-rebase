import { AreaChart, Box, SectionV2, Switch, Text } from '@voiceflow/ui';
import type { BaseProps } from '@voiceflow/ui-next';
import React from 'react';

import { QueryState } from '../../../constants';
import type { GraphResult, QueryResult } from '../../../types';
import AnalyticsDashboardChartEmpty from '../AnalyticsDashboardTileEmpty';
import DeltaLabel from './DeltaLabel';
import { getGraphColor, periodToAreaChartFormatter } from './utils';

interface AnalyticsDashboardChartGraphProps extends BaseProps {
  query: QueryResult<GraphResult>;
  size: 'small' | 'large';
}

const Chart = ({ query, size, testID }: AnalyticsDashboardChartGraphProps) => {
  if (!query.data) {
    throw new TypeError('Expected query data to be defined');
  }

  const graphPoints = query.data.points.map(([time, value]) => ({ x: time.getTime(), y: value }));

  return (
    <Box.FlexAlignStart pb={size === 'large' ? 24 : undefined} px={32} fullWidth fullHeight={size === 'large'} column>
      <Box.FlexAlignEnd pt={12} pb={size === 'large' ? 16 : 8}>
        <Text fontSize="36px" lineHeight="50px" mr={16} data-testid={`${testID}--total`}>
          {query.data.total.toLocaleString()}
        </Text>
        {size === 'large' && <DeltaLabel data={query.data} tileSize={size} data-testid={`${testID}--delta-large`} />}
      </Box.FlexAlignEnd>

      <Box.Flex fullWidth height={size === 'large' ? '100%' : '100px'}>
        <AreaChart
          withTooltip
          withAxes={size === 'large'}
          withGrid={size === 'large'}
          formatter={periodToAreaChartFormatter(query.data.period)}
          color={size === 'small' ? getGraphColor(query.data) : undefined}
          data={graphPoints}
        />
      </Box.Flex>

      {size === 'small' && <DeltaLabel data={query.data} tileSize={size} data-testid={`${testID}--delta-small`} />}
    </Box.FlexAlignStart>
  );
};

const AnalyticsDashboardTileGraph: React.FC<AnalyticsDashboardChartGraphProps> = ({ query, size, testID }) => {
  return (
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

      <Switch.Pane value={QueryState.SUCCESS}>
        {query.data ? (
          <Chart query={query} size={size} testID={testID} />
        ) : (
          <AnalyticsDashboardChartEmpty query={query} />
        )}
      </Switch.Pane>
    </Switch>
  );
};

export default AnalyticsDashboardTileGraph;
