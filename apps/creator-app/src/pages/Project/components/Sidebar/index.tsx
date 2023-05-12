import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Path } from '@/config/routes';

import { CanvasIconMenu, IntegrationsSidebar, LogoOffsetSidebar, NLUSidebar, SettingsSidebar, TestVariablesSidebar } from './components';

const ALL_PROJECT_SIDEBAR_PATHS = [
  Path.DOMAIN_CANVAS,
  Path.CANVAS_COMMENTING,
  Path.CANVAS_COMMENTING_THREAD,
  Path.CANVAS_MODEL,
  Path.CANVAS_MODEL_ENTITY,
  Path.PROJECT_ANALYTICS,
  Path.PROJECT_KNOWLEDGE_BASE,
];

const ProjectSidebar: React.FC = () => (
  <Switch>
    <Route path={ALL_PROJECT_SIDEBAR_PATHS} render={() => <CanvasIconMenu />} />

    <Route path={Path.NLU_MANAGER} render={() => <NLUSidebar />} />

    <Route path={Path.PROJECT_PROTOTYPE} render={() => <TestVariablesSidebar />} />

    <Route path={Path.PROJECT_PUBLISH} render={() => <IntegrationsSidebar />} />

    <Route path={Path.PROJECT_SETTINGS} render={() => <SettingsSidebar />} />

    <Route path={Path.CONVERSATIONS} render={() => <LogoOffsetSidebar />} />
  </Switch>
);

export default React.memo(ProjectSidebar);
