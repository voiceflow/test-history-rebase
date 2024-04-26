import { Box, DonutChart, SectionV2, Switch } from '@voiceflow/ui';
import type { BaseProps } from '@voiceflow/ui-next';
import React from 'react';

import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';

import { QueryState } from '../../../constants';
import type { DonutChartResult, QueryResult } from '../../../types';
import AnalyticsDashboardChartEmpty from '../AnalyticsDashboardTileEmpty';
import * as S from './styles';

interface AnalyticsDashboardChartDonutProps extends BaseProps {
  query: QueryResult<DonutChartResult>;
}

const Chart = ({ query, testID }: AnalyticsDashboardChartDonutProps) => {
  if (!query.data) {
    throw new TypeError('Expected query data to be defined');
  }

  const dispatchGoToTranscript = useDispatch(Router.goToTargetTranscript);

  const openTranscripts = () => {
    // TODO: find correct transcript to open?
    dispatchGoToTranscript('');
  };

  return (
    <Box.FlexAlignStart px={32} fullWidth column height={200 + 18} position="relative">
      <S.StatisticsContainer>
        <DonutChart.Statistics
          percentage={Math.round(query.data.mainPercentage * 100 * 100) / 100}
          delta={
            query.data.changeSincePreviousPeriod ? Math.round(query.data.changeSincePreviousPeriod * 100) : undefined
          }
          testID={testID}
        />
      </S.StatisticsContainer>
      <DonutChart data={query.data.data} withRadialTicks withTooltip onClick={openTranscripts} />
    </Box.FlexAlignStart>
  );
};

const AnalyticsDashboardTileDonut: React.FC<AnalyticsDashboardChartDonutProps> = ({ query, testID }) => {
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
        {query.data ? <Chart query={query} testID={testID} /> : <AnalyticsDashboardChartEmpty query={query} />}
      </Switch.Pane>
    </Switch>
  );
};

export default AnalyticsDashboardTileDonut;
