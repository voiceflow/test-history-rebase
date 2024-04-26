import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Path } from '@/config/routes';

import {
  CanvasIconMenu,
  IntegrationsSidebar,
  LogoOffsetSidebar,
  SettingsSidebar,
  TestVariablesSidebar,
} from './components';

const ALL_PROJECT_SIDEBAR_PATHS = [
  Path.DOMAIN_CANVAS,
  Path.PROJECT_CANVAS,
  Path.CANVAS_COMMENTING,
  Path.PROJECT_ANALYTICS,
  Path.DOMAIN_CANVAS_COMMENTING,
  Path.CANVAS_COMMENTING_THREAD,
  Path.DOMAIN_CANVAS_COMMENTING_THREAD,
];

const ProjectSidebar: React.FC = () => (
  <Switch>
    <Route path={ALL_PROJECT_SIDEBAR_PATHS} render={() => <CanvasIconMenu />} />

    <Route path={Path.PROJECT_PROTOTYPE} render={() => <TestVariablesSidebar />} />

    <Route path={Path.PROJECT_PUBLISH} render={() => <IntegrationsSidebar />} />

    <Route path={Path.PROJECT_SETTINGS} render={() => <SettingsSidebar />} />

    <Route path={Path.PROJECT_CONVERSATIONS} render={() => <LogoOffsetSidebar />} />
  </Switch>
);

export default React.memo(ProjectSidebar);
