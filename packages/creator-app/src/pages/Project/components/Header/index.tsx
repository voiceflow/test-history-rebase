import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Path } from '@/config/routes';

import {
  AnalyticsDashboardHeader,
  BackHeader,
  CanvasHeader,
  ConversationsHeader,
  IntegrationsHeader,
  NLUHeader,
  PrototypeHeader,
  SettingsHeader,
} from './components';

const ProjectHeader: React.FC = () => (
  <Switch>
    <Route
      path={[Path.DOMAIN_CANVAS, Path.CANVAS_COMMENTING, Path.CANVAS_COMMENTING_THREAD, Path.CANVAS_MODEL, Path.CANVAS_MODEL_ENTITY]}
      component={CanvasHeader}
    />

    <Route path={Path.PROJECT_PROTOTYPE} component={PrototypeHeader} />

    <Route path={Path.NLU_MANAGER} component={NLUHeader} />

    <Route path={Path.PROJECT_PUBLISH} component={IntegrationsHeader} />

    <Route path={Path.PROJECT_SETTINGS} component={SettingsHeader} />

    <Route path={Path.CONVERSATIONS} component={ConversationsHeader} />

    <Route path={Path.ANALYTICS_DASHBOARD} component={AnalyticsDashboardHeader} />

    <Route component={BackHeader} />
  </Switch>
);

export default ProjectHeader;
