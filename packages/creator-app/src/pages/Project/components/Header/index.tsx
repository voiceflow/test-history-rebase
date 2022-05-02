import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Path } from '@/config/routes';

import { BackHeader, CanvasHeader, ConversationsHeader, IntegrationsHeader, PrototypeHeader, SettingsHeader } from './components';

const ProjectHeader: React.FC = () => (
  <Switch>
    <Route
      path={[Path.PROJECT_CANVAS, Path.CANVAS_COMMENTING, Path.CANVAS_COMMENTING_THREAD, Path.CANVAS_MODEL, Path.CANVAS_MODEL_ENTITY]}
      component={CanvasHeader}
    />

    <Route path={Path.PROJECT_PROTOTYPE} component={PrototypeHeader} />

    <Route path={Path.PROJECT_PUBLISH} component={IntegrationsHeader} />

    <Route path={Path.PROJECT_SETTINGS} component={SettingsHeader} />

    <Route path={Path.CONVERSATIONS} component={ConversationsHeader} />

    <Route component={BackHeader} />
  </Switch>
);

export default ProjectHeader;
