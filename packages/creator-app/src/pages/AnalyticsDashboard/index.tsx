import React from 'react';

import ProjectPage from '@/pages/Project/components/ProjectPage';

import { AnalyticsDashboardContainer } from './components';

const AnalyticsDashboard: React.FC = () => {
  return (
    <ProjectPage shouldRenderHeader={true} sideBarProps={{ withLogo: false }}>
      <AnalyticsDashboardContainer>
        <p>super WIP!!!</p>
      </AnalyticsDashboardContainer>
    </ProjectPage>
  );
};

export default AnalyticsDashboard;
