import { ThemeColor } from '@voiceflow/ui';
import React from 'react';

import ProjectPage from '@/pages/Project/components/ProjectPage';

import { AnalyticsDashboardContainer, AnalyticsDashboardFiltersHeader, AnalyticsDashboardGrid, AnalyticsDashboardTile, Charts } from './components';
import { PeriodFilterOption } from './components/AnalyticsDashboardFiltersHeader/constants';

const AnalyticsDashboard: React.OldFC = () => {
  const [periodFilter, setPeriodFilter] = React.useState(PeriodFilterOption.LAST_7_DAYS);

  return (
    <ProjectPage>
      <AnalyticsDashboardContainer>
        <AnalyticsDashboardFiltersHeader periodFilter={periodFilter} setPeriodFilter={setPeriodFilter} />
        <AnalyticsDashboardGrid>
          {/* Row 1 */}
          <AnalyticsDashboardTile
            title="Interactions"
            description="Total number of engagements users have had with your assistant."
            width={2}
            height={1}
          >
            <Charts.AnalyticsDashboardChartEmpty />
          </AnalyticsDashboardTile>
          <AnalyticsDashboardTile
            title="Recognition rate"
            description="The % of messages understood by your assistant."
            labels={[
              { title: 'Recognized', color: ThemeColor.BLUE },
              { title: 'Not understood', color: ThemeColor.RED },
            ]}
            width={1}
            height={1}
          >
            <Charts.AnalyticsDashboardChartEmpty />
          </AnalyticsDashboardTile>

          {/* Row 2 */}
          <AnalyticsDashboardTile title="Users" description="Unique users that have engaged with your assistant." width={1} height={1}>
            <Charts.AnalyticsDashboardChartEmpty />
          </AnalyticsDashboardTile>
          <AnalyticsDashboardTile title="Sessions" description="Unique users that have engaged with your assistant." width={1} height={1}>
            <Charts.AnalyticsDashboardChartEmpty />
          </AnalyticsDashboardTile>
          <AnalyticsDashboardTile title="Top Intents" description="The most popular queries users ask your assistant." width={1} height={1}>
            <Charts.AnalyticsDashboardChartEmpty />
          </AnalyticsDashboardTile>
        </AnalyticsDashboardGrid>
      </AnalyticsDashboardContainer>
    </ProjectPage>
  );
};

export default AnalyticsDashboard;
