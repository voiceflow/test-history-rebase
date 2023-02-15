import { Box } from '@voiceflow/ui';
import React from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';

import { Path } from '@/config/routes';
import ProjectPage from '@/pages/Project/components/ProjectPage';
import { Identifier } from '@/styles/constants';

import GeneralSettings from './components/GeneralSettings';
import ProjectVersions from './components/ProjectVersions';

const width = 958;
const padding = 32;
const maxWidth = width + 2 * padding;

const Settings: React.FC = () => {
  const location = useLocation();

  return (
    <ProjectPage>
      <Box id={Identifier.SETTINGS_PAGE} maxWidth={maxWidth} p={padding}>
        <Switch>
          <Route path={Path.PROJECT_GENERAL_SETTINGS} component={GeneralSettings} />
          <Route path={Path.PROJECT_VERSION_SETTINGS} component={ProjectVersions} />

          <Redirect to={{ state: location.state, pathname: Path.PROJECT_GENERAL_SETTINGS }} />
        </Switch>
      </Box>
    </ProjectPage>
  );
};

export default Settings;
