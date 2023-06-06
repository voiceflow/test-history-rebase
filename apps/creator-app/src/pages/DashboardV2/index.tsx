import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

import { Path } from '@/config/routes';
import { Permission } from '@/constants/permissions';
import * as Router from '@/ducks/router';
import { WorkspaceFeatureLoadingGate, WorkspaceSubscriptionGate } from '@/gates';
import { withBatchLoadingGate } from '@/hocs/withBatchLoadingGate';
import { useDispatch, usePermission, useSetup } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import * as Query from '@/utils/query';

import { DashboardGate } from './gates';
import { Account, MembersAndBilling, Organization, Settings, TemporaryProjectList } from './pages';

const Dashboard: React.FC = () => {
  const location = useLocation();
  const clearSearch = useDispatch(Router.clearSearch);

  const [canConfigureSSO] = usePermission(Permission.ORGANIZATION_CONFIGURE_SSO);
  const [canManageOrgMembers] = usePermission(Permission.ORGANIZATION_MANAGE_MEMBERS);

  const query = location?.search ? Query.parse(location.search) : null;
  const importModal = ModalsV2.useModal(ModalsV2.Project.Import);

  useSetup(() => {
    if (query?.import) {
      clearSearch();
      importModal.openVoid({ projectID: query?.import });
    }
  });

  return (
    <Switch>
      <Route path={[Path.WORKSPACE_PROFILE, Path.WORKSPACE_INTEGRATIONS]} component={Account} />
      <Route path={[Path.WORKSPACE_BILLING, Path.WORKSPACE_MEMBERS]} component={MembersAndBilling} />
      <Route path={Path.WORKSPACE_SETTINGS} component={Settings} />
      {(canConfigureSSO || canManageOrgMembers) && <Route path={Path.WORKSPACE_ORGANIZATION} component={Organization} />}
      <Route path={Path.WORKSPACE_DASHBOARD} component={TemporaryProjectList} />
    </Switch>
  );
};

export default withBatchLoadingGate(DashboardGate, WorkspaceFeatureLoadingGate, WorkspaceSubscriptionGate)(Dashboard);
