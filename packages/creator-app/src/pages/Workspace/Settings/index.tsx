import { BoxFlex } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';

import Page from '@/components/Page';
import PlanBubble from '@/components/PlanBubble';
import { SettingsContainer, SettingsHeader } from '@/components/Settings';
import { Path } from '@/config/routes';
import * as Router from '@/ducks/router';
import * as Workspace from '@/ducks/workspace';
import { WorkspaceFeatureLoadingGate } from '@/gates';
import { withBatchLoadingGate } from '@/hocs';
import { useDispatch, useIsAdmin } from '@/hooks';
import RedirectWithSearch from '@/Routes/RedirectWithSearch';

import Billing from './components/Billing';
import Developer from './components/Developer';
import General from './components/General';
import { SettingsGate } from './gates';

enum Paths {
  GENERAL = 'general',
  BILLING = 'billing',
  DEVELOPER = 'developer',
}

const Settings: React.FC = () => {
  const workspace = useSelector(Workspace.activeWorkspaceSelector);
  const isAdmin = useIsAdmin();

  const goToDashboard = useDispatch(Router.goToDashboard);

  const tabs = React.useMemo(
    () => [
      { label: 'General', path: Paths.GENERAL },
      {
        label: (
          <BoxFlex alignItems="center">
            Billing&nbsp;&nbsp;
            <PlanBubble plan={workspace?.plan} disabled />
          </BoxFlex>
        ),
        path: 'billing',
      },
      { label: 'Developer', path: Paths.DEVELOPER },
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

          <Redirect to={Path.WORKSPACE_GENERAL_SETTINGS} />
        </Switch>
      </SettingsContainer>
    </Page>
  );
};

export default withBatchLoadingGate(SettingsGate, WorkspaceFeatureLoadingGate)(Settings);
