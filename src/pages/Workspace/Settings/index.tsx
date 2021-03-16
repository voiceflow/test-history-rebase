import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Switch, useRouteMatch } from 'react-router-dom';

import { Flex } from '@/components/Box';
import Page from '@/components/Page';
import PlanBubble from '@/components/PlanBubble';
import { SettingsContainer, SettingsHeader } from '@/components/Settings';
import { userSelector } from '@/ducks/account';
import * as Router from '@/ducks/router';
import { activeWorkspaceSelector } from '@/ducks/workspace';
import PrivateRoute from '@/Routes/PrivateRoute';

import Billing from './components/Billing';
import Developer from './components/Developer';
import General from './components/General';

enum Paths {
  GENERAL = 'general',
  BILLING = 'billing',
  DEVELOPER = 'developer',
}

const Settings: React.FC = () => {
  const { url } = useRouteMatch();
  const dispatch = useDispatch();
  const goToDashboard = () => dispatch(Router.goToDashboard());

  const user = useSelector(userSelector);
  const workspace = useSelector(activeWorkspaceSelector);

  const Tabs = React.useMemo(
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
  if (!workspace?.members?.filter((member) => member.role === 'admin').find(({ creator_id }) => creator_id === user.creator_id)) {
    return null;
  }

  return (
    <Page navigateBackText="Back" onNavigateBack={goToDashboard} header={<SettingsHeader>Workspace Settings</SettingsHeader>}>
      <SettingsContainer tabs={Tabs}>
        <Switch>
          <PrivateRoute path={`${url}/${Paths.GENERAL}`} component={General} />
          <PrivateRoute path={`${url}/${Paths.DEVELOPER}`} component={Developer} />
          <PrivateRoute path={`${url}/${Paths.BILLING}`} component={Billing} />
          <Redirect from="*" to={`${url}/${Paths.GENERAL}`} />
        </Switch>
      </SettingsContainer>
    </Page>
  );
};

export default Settings;
