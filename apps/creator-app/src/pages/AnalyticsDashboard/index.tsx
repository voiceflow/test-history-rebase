import React from 'react';

import ProjectPage from '@/pages/Project/components/ProjectPage';

import {
  AnalyticsDashboardContainer,
  AnalyticsDashboardFiltersHeader,
  AnalyticsDashboardGrid,
  AnalyticsDashboardTile,
  Tiles,
} from './components';
import { DONUT_CHART_COLORS } from './constants';
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
            query={interactions}
          >
            <Tiles.AnalyticsDashboardTileGraph query={interactions} size="large" testID="interaction-chart" />
          </AnalyticsDashboardTile>
          <AnalyticsDashboardTile
            title="Recognition rate"
            description="The % of messages understood by your assistant."
            labels={[
              { title: 'Recognized', color: DONUT_CHART_COLORS.GOOD },
              { title: 'Not understood', color: DONUT_CHART_COLORS.BAD },
            ]}
            width={1}
            height={1}
            query={recognitionRate}
          >
            <Tiles.AnalyticsDashboardTileDonut query={recognitionRate} testID="recognition-rate-chart" />
          </AnalyticsDashboardTile>

          {/* Row 2 */}
          <AnalyticsDashboardTile
            title="Users"
            description="Unique user sessions with your assistant."
            width={1}
            height={1}
            query={users}
          >
            <Tiles.AnalyticsDashboardTileGraph query={users} size="small" testID="unique-users-chart" />
          </AnalyticsDashboardTile>
          <AnalyticsDashboardTile
            title="Sessions"
            description="Unique user sessions with your assistant."
            width={1}
            height={1}
            query={sessions}
          >
            <Tiles.AnalyticsDashboardTileGraph query={sessions} size="small" testID="unique-sessions-chart" />
          </AnalyticsDashboardTile>
          <AnalyticsDashboardTile
            title="Top Intents"
            description="The most popular queries users ask your assistant."
            width={1}
            height={1}
            query={topIntents}
          >
            <Tiles.AnalyticsDashboardTileBars query={topIntents} testID="intent-chart" />
          </AnalyticsDashboardTile>
        </AnalyticsDashboardGrid>
      </AnalyticsDashboardContainer>
    </ProjectPage>
  );
};

export default AnalyticsDashboard;
