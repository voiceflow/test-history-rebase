import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Path } from '@/config/routes';

import { CanvasIconMenu, ConversationsSidebar, IntegrationsSidebar, SettingsSidebar, TestVariablesSidebar } from './components';

const ProjectSidebar: React.FC = () => {
  return (
    <Switch>
      <Route
        path={[Path.PROJECT_CANVAS, Path.CANVAS_COMMENTING, Path.CANVAS_COMMENTING_THREAD, Path.CANVAS_MODEL, Path.CANVAS_MODEL_ENTITY]}
        component={CanvasIconMenu}
      />

      <Route path={Path.PROJECT_PROTOTYPE} component={TestVariablesSidebar} />

      <Route path={Path.PROJECT_PUBLISH} component={IntegrationsSidebar} />

      <Route path={Path.PROJECT_SETTINGS} component={SettingsSidebar} />

      <Route path={Path.CONVERSATIONS} component={ConversationsSidebar} />
    </Switch>
  );
};

export default ProjectSidebar;
