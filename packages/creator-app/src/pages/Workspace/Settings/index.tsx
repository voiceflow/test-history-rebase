import { BoxFlex } from '@voiceflow/ui';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Page from '@/components/Page';
import PlanBubble from '@/components/PlanBubble';
import { SettingsContainer, SettingsHeader } from '@/components/Settings';
import { Permission } from '@/config/permissions';
import { Path, WorkspaceSettingsRoute } from '@/config/routes';
import * as Router from '@/ducks/router';
import { WorkspaceFeatureLoadingGate } from '@/gates';
import { withBatchLoadingGate } from '@/hocs';
import { useActiveWorkspace, useDispatch, useIsAdmin, usePermission } from '@/hooks';
import RedirectWithSearch from '@/Routes/RedirectWithSearch';

import Billing from './components/Billing';
import Developer from './components/Developer';
import General from './components/General';
import SSO from './components/SSO';
import { SettingsGate } from './gates';

const Settings: React.FC = () => {
  const workspace = useActiveWorkspace();
  const isAdmin = useIsAdmin();

  const [orgPermission] = usePermission(Permission.CONFIGURE_ORGANIZATION);
  const goToDashboard = useDispatch(Router.goToDashboard);

  const ssoPermission = orgPermission && workspace?.organizationID;

  const tabs = React.useMemo(
    () => [
      { label: 'General', path: WorkspaceSettingsRoute.GENERAL },
      {
        label: (
          <BoxFlex alignItems="center">
            Billing&nbsp;&nbsp;
            <PlanBubble plan={workspace?.plan} disabled />
          </BoxFlex>
        ),
        path: 'billing',
      },
      ...(ssoPermission ? [{ label: 'SSO', path: WorkspaceSettingsRoute.SSO }] : []),
      { label: 'Developer', path: WorkspaceSettingsRoute.DEVELOPER },
    ],
    [workspace?.plan]
  );

  // do not show for the no-admin users
  if (!isAdmin) {
    return <RedirectWithSearch to={Path.DASHBOARD} />;
  }

  return (
    <Page navigateBackText="Back" onNavigateBack={goToDashboard} header={<SettingsHeader>Workspace Settings</SettingsHeader>}>
      <SettingsContainer tabs={tabs}>
        <Switch>
          <Route path={Path.WORKSPACE_GENERAL_SETTINGS} component={General} />
          <Route path={Path.WORKSPACE_DEVELOPER_SETTINGS} component={Developer} />
          <Route path={Path.WORKSPACE_BILLING_SETTINGS} component={Billing} />
          {ssoPermission && <Route path={Path.WORKSPACE_SSO_SETTINGS} component={SSO} />}

          <Redirect to={Path.WORKSPACE_GENERAL_SETTINGS} />
        </Switch>
      </SettingsContainer>
    </Page>
  );
};

export default withBatchLoadingGate(SettingsGate, WorkspaceFeatureLoadingGate)(Settings);
