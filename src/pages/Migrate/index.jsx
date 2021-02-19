import React from 'react';

import MigrateContainer from './components/MigrateContainer';
import MigrateStages from './components/MigrateStages';

const MigratePage = () => (
  <MigrateContainer>
    <h1>Skill Migration Tool</h1>
    <MigrateStages />
  </MigrateContainer>
);

export default MigratePage;
