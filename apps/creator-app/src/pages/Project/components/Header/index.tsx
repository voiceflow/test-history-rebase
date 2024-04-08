import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Path } from '@/config/routes';

import {
  AnalyticsDashboardHeader,
  BackHeader,
  CanvasHeader,
  IntegrationsHeader,
  LogoOnlyHeader,
  PrototypeHeader,
  SettingsHeader,
} from './components';

const ProjectHeader: React.FC = () => (
  <Switch>
    <Route
      path={[
        Path.DOMAIN_CANVAS,
        Path.PROJECT_CANVAS,
        Path.CANVAS_COMMENTING,
        Path.DOMAIN_CANVAS_COMMENTING,
        Path.CANVAS_COMMENTING_THREAD,
        Path.DOMAIN_CANVAS_COMMENTING_THREAD,
      ]}
      component={CanvasHeader}
    />

    <Route path={Path.PROJECT_PROTOTYPE} component={PrototypeHeader} />

    <Route path={Path.PROJECT_PUBLISH} component={IntegrationsHeader} />

    <Route path={Path.PROJECT_SETTINGS} component={SettingsHeader} />

    <Route path={Path.PROJECT_CONVERSATIONS} component={LogoOnlyHeader} />

    <Route path={Path.PROJECT_ANALYTICS} component={AnalyticsDashboardHeader} />

    <Route component={BackHeader} />
  </Switch>
);

export default ProjectHeader;
