import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Path } from '@/config/routes';

import { CanvasIconMenu, ConversationsSidebar, IntegrationsSidebar, SettingsSidebar, TestVariablesSidebar } from './components';
import { SideBarComponentProps } from './types';

const ALL_PROJECT_SIDEBAR_PATHS = [
  Path.DOMAIN_CANVAS,
  Path.CANVAS_COMMENTING,
  Path.CANVAS_COMMENTING_THREAD,
  Path.CANVAS_MODEL,
  Path.CANVAS_MODEL_ENTITY,
  Path.NLU_MANAGER,
];

export * from './types';

const ProjectSidebar: React.FC<SideBarComponentProps> = ({ ...props }) => (
  <Switch>
    <Route path={ALL_PROJECT_SIDEBAR_PATHS} render={() => <CanvasIconMenu {...props} />} />

    <Route path={Path.PROJECT_PROTOTYPE} render={() => <TestVariablesSidebar {...props} />} />

    <Route path={Path.PROJECT_PUBLISH} render={() => <IntegrationsSidebar {...props} />} />

    <Route path={Path.PROJECT_SETTINGS} render={() => <SettingsSidebar {...props} />} />

    <Route path={Path.CONVERSATIONS} render={() => <ConversationsSidebar {...props} />} />
  </Switch>
);

export default React.memo(ProjectSidebar);
