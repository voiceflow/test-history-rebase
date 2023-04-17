import React from 'react';

import ProjectPage from '@/pages/Project/components/ProjectPage';

import MigrateContainer from './components/MigrateContainer';
import MigrateStages from './components/MigrateStages';

const MigratePage: React.FC = () => (
  <ProjectPage>
    <MigrateContainer>
      <h1>Skill Migration Tool</h1>
      <MigrateStages />
    </MigrateContainer>
  </ProjectPage>
);

export default MigratePage;
