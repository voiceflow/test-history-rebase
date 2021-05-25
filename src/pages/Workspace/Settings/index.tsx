import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';

import { Flex } from '@/components/Box';
import Page from '@/components/Page';
import PlanBubble from '@/components/PlanBubble';
import { SettingsContainer, SettingsHeader } from '@/components/Settings';
import { Path } from '@/config/routes';
import { userSelector } from '@/ducks/account';
import * as Router from '@/ducks/router';
import { activeWorkspaceSelector } from '@/ducks/workspace';
import { WorkspaceFeatureLoadingGate } from '@/gates';
import { withBatchLoadingGate } from '@/hocs';
import RedirectWithSearch from '@/Routes/RedirectWithSearch';

import Billing from './components/Billing';
import Developer from './components/Developer';
import General from './components/General';

enum Paths {
  GENERAL = 'general',
  BILLING = 'billing',
  DEVELOPER = 'developer',
}

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const goToDashboard = () => dispatch(Router.goToDashboard());

  const user = useSelector(userSelector);
  const workspace = useSelector(activeWorkspaceSelector);

  const tabs = React.useMemo(
    () => [
      { label: 'General', path: Paths.GENERAL },
      {
        label: (
          <Flex alignItems="center">
            Billing&nbsp;&nbsp;
            <PlanBubble plan={workspace?.plan} disabled />
          </Flex>
        ),
        path: 'billing',
      },
      { label: 'Developer', path: Paths.DEVELOPER },
    ],
    [workspace?.plan]
  );

  // do not show for the no-admin users
  if (!workspace?.members.filter((member) => member.role === 'admin').find(({ creator_id }) => creator_id === user.creator_id)) {
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

export default withBatchLoadingGate(WorkspaceFeatureLoadingGate)(Settings);
