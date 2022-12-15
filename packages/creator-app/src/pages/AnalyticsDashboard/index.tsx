import { ThemeColor } from '@voiceflow/ui';
import React from 'react';

import ProjectPage from '@/pages/Project/components/ProjectPage';

import AnalyticsDashboardContainer from './components/AnalyticsDashboardContainer';
import AnalyticsDashboardGrid from './components/AnalyticsDashboardGrid';
import AnalyticsDashboardTile from './components/AnalyticsDashboardTile';

const AnalyticsDashboard: React.FC = () => {
  return (
    <ProjectPage>
      <AnalyticsDashboardContainer column>
        <AnalyticsDashboardGrid>
          {/* Row 1 */}
          <AnalyticsDashboardTile
            title="Interactions"
            description="Total number of engagements users have had with your assistant."
            width={2}
            height={1}
          />
          <AnalyticsDashboardTile
            title="Recognition rate"
            description="The % of messages understood by your assistant."
            labels={[
              { title: 'Recognized', color: ThemeColor.BLUE },
              { title: 'Not understood', color: ThemeColor.RED },
            ]}
            width={1}
            height={1}
          />

          {/* Row 2 */}
          <AnalyticsDashboardTile title="Users" description="Unique users that have engaged with your assistant." width={1} height={1} />
          <AnalyticsDashboardTile title="Sessions" description="Unique users that have engaged with your assistant." width={1} height={1} />
          <AnalyticsDashboardTile title="Top Intents" description="The most popular queries users ask your assistant." width={1} height={1} />
        </AnalyticsDashboardGrid>
      </AnalyticsDashboardContainer>
    </ProjectPage>
  );
};

export default AnalyticsDashboard;
