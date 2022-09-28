import * as Realtime from '@voiceflow/realtime-sdk';
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
import { useActiveWorkspace, useDispatch, useFeature, usePermission } from '@/hooks';
import RedirectWithSearch from '@/Routes/RedirectWithSearch';

import Billing from './components/Billing';
import Developer from './components/Developer';
import General from './components/General';
import SSO from './components/SSO';
import SettingsGate from './gates/SettingsGate';

const Settings: React.FC = () => {
  const workspace = useActiveWorkspace();
  const disableIntegation = useFeature(Realtime.FeatureFlag.DISABLE_INTEGRATION)?.isEnabled;

  const [canConfigureOrganization] = usePermission(Permission.CONFIGURE_ORGANIZATION);
  const [canViewSettingsWorkspace] = usePermission(Permission.VIEW_SETTINGS_WORKSPACE);
  const [canConfigureWorkspaceBilling] = usePermission(Permission.CONFIGURE_WORKSPACE_BILLING);
  const canConfigureWorkspaceDeveloper = usePermission(Permission.CONFIGURE_WORKSPACE_DEVELOPER)[0] && !disableIntegation;
  const goToDashboard = useDispatch(Router.goToDashboard);

  const canManageSSO = canConfigureOrganization && workspace?.organizationID;

  const tabs = React.useMemo(
    () => [
      { label: 'General', path: WorkspaceSettingsRoute.GENERAL },
      ...(canConfigureWorkspaceBilling
        ? [
            {
              label: (
                <BoxFlex alignItems="center">
                  Billing&nbsp;&nbsp;
                  <PlanBubble plan={workspace?.plan} disabled />
                </BoxFlex>
              ),
              path: 'billing',
            },
          ]
        : []),
      ...(canManageSSO ? [{ label: 'SSO', path: WorkspaceSettingsRoute.SSO }] : []),
      ...(canConfigureWorkspaceDeveloper ? [{ label: 'Developer', path: WorkspaceSettingsRoute.DEVELOPER }] : []),
    ],
    [workspace?.plan]
  );

  // do not show for users without the appropriate permission
  if (!canViewSettingsWorkspace) {
    return <RedirectWithSearch to={Path.DASHBOARD} />;
  }

  return (
    <Page navigateBackText="Back" onNavigateBack={goToDashboard} header={<SettingsHeader>Workspace Settings</SettingsHeader>}>
      <SettingsContainer tabs={tabs}>
        <Switch>
          <Route path={Path.WORKSPACE_GENERAL_SETTINGS} component={General} />
          {canConfigureWorkspaceBilling && <Route path={Path.WORKSPACE_BILLING_SETTINGS} component={Billing} />}
          {canConfigureWorkspaceDeveloper && <Route path={Path.WORKSPACE_DEVELOPER_SETTINGS} component={Developer} />}
          {canManageSSO && <Route path={Path.WORKSPACE_SSO_SETTINGS} component={SSO} />}

          <Redirect to={Path.WORKSPACE_GENERAL_SETTINGS} />
        </Switch>
      </SettingsContainer>
    </Page>
  );
};

export default withBatchLoadingGate(SettingsGate, WorkspaceFeatureLoadingGate)(Settings);
