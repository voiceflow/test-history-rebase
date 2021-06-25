import { Box } from '@voiceflow/ui';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { Path } from '@/config/routes';
import { ProjectLoadingGate } from '@/gates';
import { withBatchLoadingGate } from '@/hocs';

import GeneralSettings from './components/GeneralSettings';
import ProjectVersions from './components/ProjectVersions';

const Settings: React.FC = () => (
  <Box maxWidth={700} p={32}>
    <Switch>
      <Route path={Path.PROJECT_GENERAL_SETTINGS} component={GeneralSettings} />
      <Route path={Path.PROJECT_VERSION_SETTINGS} component={ProjectVersions} />
      <Redirect to={Path.PROJECT_GENERAL_SETTINGS} />
    </Switch>
  </Box>
);

export default withBatchLoadingGate(ProjectLoadingGate)(Settings);
