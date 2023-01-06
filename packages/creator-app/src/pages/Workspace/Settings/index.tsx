import * as Realtime from '@voiceflow/realtime-sdk';
import { Box } from '@voiceflow/ui';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Page from '@/components/Page';
import { Permission } from '@/config/permissions';
import { Path } from '@/config/routes';
import * as Router from '@/ducks/router';
import { WorkspaceFeatureLoadingGate } from '@/gates';
import { withBatchLoadingGate } from '@/hocs/withBatchLoadingGate';
import { useActiveWorkspace, useDispatch, useFeature, usePermission } from '@/hooks';
import RedirectWithSearch from '@/Routes/RedirectWithSearch';

import Billing from './components/Billing';
import Developer from './components/Developer';
import General from './components/General';
import Sidebar from './components/Sidebar';
import SSO from './components/SSO';
import SettingsGate from './gates/SettingsGate';

const Settings: React.OldFC = () => {
  const workspace = useActiveWorkspace();
  const disableIntegation = useFeature(Realtime.FeatureFlag.DISABLE_INTEGRATION)?.isEnabled;

  const goToDashboard = useDispatch(Router.goToDashboard);

  const [canConfigureOrganization] = usePermission(Permission.CONFIGURE_ORGANIZATION);
  const [canViewSettingsWorkspace] = usePermission(Permission.VIEW_SETTINGS_WORKSPACE);
  const [canConfigureWorkspaceBilling] = usePermission(Permission.CONFIGURE_WORKSPACE_BILLING);
  const canConfigureWorkspaceDeveloper = usePermission(Permission.CONFIGURE_WORKSPACE_DEVELOPER)[0] && !disableIntegation;

  const canManageSSO = canConfigureOrganization && workspace?.organizationID;

  // do not show for users without the appropriate permission
  if (!canViewSettingsWorkspace) {
    return <RedirectWithSearch to={Path.DASHBOARD} />;
  }

  return (
    <Page
      renderHeader={() => (
        <Page.Header>
          <Page.Header.BackButton navSidebarWidth onClick={() => goToDashboard()} />
          <Page.Header.Title>Workspace Settings</Page.Header.Title>
        </Page.Header>
      )}
      renderSidebar={() => <Sidebar />}
    >
      <Box maxWidth={900} p={32}>
        <Switch>
          <Route path={Path.WORKSPACE_GENERAL_SETTINGS} component={General} />

          {canManageSSO && <Route path={Path.WORKSPACE_SSO_SETTINGS} component={SSO} />}
          {canConfigureWorkspaceBilling && <Route path={Path.WORKSPACE_BILLING_SETTINGS} component={Billing} />}
          {canConfigureWorkspaceDeveloper && <Route path={Path.WORKSPACE_DEVELOPER_SETTINGS} component={Developer} />}

          <Redirect to={Path.WORKSPACE_GENERAL_SETTINGS} />
        </Switch>
      </Box>
    </Page>
  );
};

export default withBatchLoadingGate(SettingsGate, WorkspaceFeatureLoadingGate)(Settings);
