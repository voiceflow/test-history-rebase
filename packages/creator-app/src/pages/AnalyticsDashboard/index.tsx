import { ThemeColor } from '@voiceflow/ui';
import React from 'react';

import ProjectPage from '@/pages/Project/components/ProjectPage';

import { AnalyticsDashboardContainer, AnalyticsDashboardFiltersHeader, AnalyticsDashboardGrid, AnalyticsDashboardTile, Charts } from './components';
import { AnalyticsDashboardContext } from './context';

const AnalyticsDashboard: React.FC = () => {
  const analyticsDashboard = React.useContext(AnalyticsDashboardContext);

  const { interactions, recognitionRate, users, sessions, topIntents } = analyticsDashboard;

  return (
    <ProjectPage>
      <AnalyticsDashboardContainer>
        <AnalyticsDashboardFiltersHeader />
        <AnalyticsDashboardGrid>
          {/* Row 1 */}
          <AnalyticsDashboardTile
            title="Interactions"
            description="Total number of engagements users have had with your assistant."
            width={2}
            height={1}
          >
            <Charts.AnalyticsDashboardChartGraph query={interactions} />
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
            <Charts.AnalyticsDashboardChartDonut query={recognitionRate} />
          </AnalyticsDashboardTile>

          {/* Row 2 */}
          <AnalyticsDashboardTile title="Users" description="Unique users that have engaged with your assistant." width={1} height={1}>
            <Charts.AnalyticsDashboardChartGraph query={users} />
          </AnalyticsDashboardTile>
          <AnalyticsDashboardTile title="Sessions" description="Unique users that have engaged with your assistant." width={1} height={1}>
            <Charts.AnalyticsDashboardChartGraph query={sessions} />
          </AnalyticsDashboardTile>
          <AnalyticsDashboardTile title="Top Intents" description="The most popular queries users ask your assistant." width={1} height={1}>
            <Charts.AnalyticsDashboardChartBars query={topIntents} />
          </AnalyticsDashboardTile>
        </AnalyticsDashboardGrid>
      </AnalyticsDashboardContainer>
    </ProjectPage>
  );
};

export default AnalyticsDashboard;
