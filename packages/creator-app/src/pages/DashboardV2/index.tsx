import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Path } from '@/config/routes';
import { WorkspaceFeatureLoadingGate, WorkspaceSubscriptionGate } from '@/gates';
import { withBatchLoadingGate } from '@/hocs/withBatchLoadingGate';

import { DashboardGate } from './gates';
import { Account, MembersAndBilling, Organization, ProjectList } from './pages';

const Dashboard: React.FC = () => (
  <Switch>
    <Route path={[Path.WORKSPACE_PROFILE, Path.WORKSPACE_INTEGRATIONS]} component={Account} />
    <Route path={[Path.WORKSPACE_BILLING, Path.WORKSPACE_MEMBERS]} component={MembersAndBilling} />
    <Route path={[Path.WORKSPACE_GENERAL_ORG, Path.WORKSPACE_MEMBERS_ORG, Path.WORKSPACE_SSO_ORG]} component={Organization} />
    <Route path={Path.WORKSPACE_DASHBOARD} component={ProjectList} />
  </Switch>
);

export default withBatchLoadingGate(DashboardGate, WorkspaceFeatureLoadingGate, WorkspaceSubscriptionGate)(Dashboard);
