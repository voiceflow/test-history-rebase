import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

import { Path } from '@/config/routes';
import * as Router from '@/ducks/router';
import { WorkspaceFeatureLoadingGate, WorkspaceSubscriptionGate } from '@/gates';
import { withBatchLoadingGate } from '@/hocs/withBatchLoadingGate';
import { useDispatch, useSetup, useWorkspaceTracking } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import perf, { PerfAction } from '@/performance';
import * as Query from '@/utils/query';

import { DashboardGate } from './gates';
import { Account, MembersAndBilling, Organization, Settings, TemporaryProjectList } from './pages';

const Dashboard: React.FC = () => {
  const location = useLocation();
  const clearSearch = useDispatch(Router.clearSearch);

  const query = location?.search ? Query.parse(location.search) : null;
  const importModal = ModalsV2.useModal(ModalsV2.Project.Import);

  useSetup(() => {
    perf.action(PerfAction.DASHBOARD_RENDERED);

    if (query?.import) {
      clearSearch();
      importModal.openVoid({ projectID: query?.import });
    }
  });

  useWorkspaceTracking();

  return (
    <Switch>
      <Route path={[Path.WORKSPACE_PROFILE, Path.WORKSPACE_INTEGRATIONS]} component={Account} />
      <Route path={[Path.WORKSPACE_BILLING, Path.WORKSPACE_MEMBERS]} component={MembersAndBilling} />
      <Route path={[Path.WORKSPACE_SETTINGS]} component={Settings} />
      <Route path={[Path.WORKSPACE_GENERAL_ORG, Path.WORKSPACE_MEMBERS_ORG, Path.WORKSPACE_SSO_ORG]} component={Organization} />
      <Route path={Path.WORKSPACE_DASHBOARD} component={TemporaryProjectList} />
    </Switch>
  );
};

export default withBatchLoadingGate(DashboardGate, WorkspaceFeatureLoadingGate, WorkspaceSubscriptionGate)(Dashboard);
