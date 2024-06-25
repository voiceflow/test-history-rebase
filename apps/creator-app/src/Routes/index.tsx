import { Box, Button, Page404 } from '@voiceflow/ui';
import { TabLoader } from '@voiceflow/ui-next';
import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { ZendeskCallback } from '@/components/Integrations/ZendeskCallback.component';
import { Path } from '@/config/routes';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { lazy } from '@/hocs/lazy';
import { withWorkspaceOrProjectAssetsSuspense } from '@/hocs/withWorkspaceOrProjectAssetsSuspense';
import { useDispatch, useSelector } from '@/hooks';
import Login from '@/pages/Auth/Login';
import LoginSSOCallback from '@/pages/Auth/LoginSSOCallback';
import ResetEmail from '@/pages/Auth/ResetEmail';
import ResetPassword from '@/pages/Auth/ResetPassword';
import Signup from '@/pages/Auth/Signup';
import Export from '@/pages/Export';
import Onboarding from '@/pages/Onboarding';
import WorkspaceAcceptInvite from '@/pages/WorkspaceAcceptInvite';

import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const Project = withWorkspaceOrProjectAssetsSuspense(lazy(() => import('@/pages/Project')));
const Workspace = withWorkspaceOrProjectAssetsSuspense(lazy(() => import('@/pages/Workspace')));

const Logout = lazy(() => import('@/pages/Auth/Logout'));
const Runtime = lazy(() => import('@/pages/Runtime'));
const ConfirmEmail = lazy(() => import('@/pages/Auth/ConfirmEmail'));
const PublicPrototype = lazy(() => import('@/pages/PublicPrototype'));
const VerifySignupEmail = lazy(() => import('@/pages/Auth/VerifySignupEmail'));

const Routes: React.FC = () => {
  const authToken = useSelector(Session.authTokenSelector);
  const goToDashboard = useDispatch(Router.goToDashboard);

  return (
    <Suspense fallback={<TabLoader variant="dark" />}>
      <Switch>
        <Route exact path={Path.LOGOUT} component={Logout} />

        <Route exact path={Path.ACCOUNT_VERIFY_EMAIL} component={VerifySignupEmail} />
        <Route exact path={Path.ACCOUNT_CONFIRM_EMAIL} component={ConfirmEmail} />

        <PublicRoute exact path={Path.RESET_PASSWORD} component={ResetPassword} />
        <PublicRoute exact path={Path.RESET} component={ResetEmail} />
        <PublicRoute exact path={Path.LOGIN} component={Login} />
        <PublicRoute exact path={Path.LOGIN_SSO_CALLBACK} component={LoginSSOCallback} />
        <PublicRoute exact path={Path.SIGNUP} component={Signup} />
        <PrivateRoute exact path={Path.ONBOARDING} component={Onboarding} />

        <PrivateRoute
          exact
          path={Path.INTEGRATION_ZENDESK_CALLBACK}
          component={ZendeskCallback}
          screenSizeWarning={false}
        />

        {/* workspace routes  */}
        <Route exact path={Path.WORKSPACE_ACCEPT_INVITE} component={WorkspaceAcceptInvite} />
        <Redirect exact from={Path.WORKSPACE} to={Path.DASHBOARD} />
        <PrivateRoute path={[Path.WORKSPACE, Path.DASHBOARD]} component={Workspace} />

        <Route path={Path.PUBLIC_PROTOTYPE} component={PublicPrototype} />

        <PrivateRoute path={Path.PROJECT_EXPORT} component={Export} />

        <PrivateRoute path={Path.PROJECT_VERSION} component={Project} />

        <PrivateRoute path={Path.RUNTIME} component={Runtime} />

        <Route
          exact
          path={Path.HOME}
          render={() =>
            authToken ? (
              <Redirect to={`${Path.DASHBOARD}${window.location.search}`} />
            ) : (
              <Redirect to={`${Path.SIGNUP}${window.location.search}`} />
            )
          }
        />

        <Route
          render={() => (
            <Page404>
              <Box mt={16}>
                <Button onClick={() => goToDashboard()}>Go to Dashboard</Button>
              </Box>
            </Page404>
          )}
        />
      </Switch>
    </Suspense>
  );
};

export default Routes;
