import { Box, Button, FullSpinner, Page404 } from '@voiceflow/ui';
import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { LegacyPath, Path } from '@/config/routes';
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

const Legal = lazy(() => import('@/components/Legal'));

const Logout = lazy(() => import('@/pages/Auth/Logout'));
const Runtime = lazy(() => import('@/pages/Runtime'));
const ConfirmEmail = lazy(() => import('@/pages/Auth/ConfirmEmail'));
const PublicPrototype = lazy(() => import('@/pages/PublicPrototype'));
const VerifySignupEmail = lazy(() => import('@/pages/Auth/VerifySignupEmail'));

const Routes: React.FC = () => {
  const authToken = useSelector(Session.authTokenSelector);
  const goToDashboard = useDispatch(Router.goToDashboard);

  return (
    <Suspense fallback={<FullSpinner name="Assets" />}>
      <Switch>
        <Route exact path={Path.LOGOUT} component={Logout} />

        <Route exact path={Path.VERIFY_SIGNUP_EMAIL} component={VerifySignupEmail} />

        <Route exact path={Path.CONFIRM_EMAIL_UPDATE} component={ConfirmEmail} />

        <PublicRoute exact path={Path.RESET_PASSWORD} component={ResetPassword} />
        <PublicRoute exact path={Path.RESET} component={ResetEmail} />
        <PublicRoute exact path={Path.LOGIN} component={Login} />
        <PublicRoute exact path={Path.LOGIN_SSO_CALLBACK} component={LoginSSOCallback} />
        <PublicRoute exact path={Path.SIGNUP} component={Signup} />
        <PrivateRoute exact path={Path.ONBOARDING} component={Onboarding} />

        <Route exact path={Path.CREATOR_TERMS} component={Legal} />

        {/* workspace routes  */}
        <Route exact path={Path.WORKSPACE_ACCEPT_INVITE} component={WorkspaceAcceptInvite} />
        <Redirect exact from={Path.WORKSPACE} to={Path.DASHBOARD} />
        <PrivateRoute path={[Path.WORKSPACE, Path.DASHBOARD]} component={Workspace} />

        <Redirect exact from={Path.PROJECT_DEMO} to={Path.PUBLIC_PROTOTYPE} />
        <Route path={Path.PUBLIC_PROTOTYPE} component={PublicPrototype} />

        <Redirect from={LegacyPath.WORKSPACE_DASHBOARD} to={Path.WORKSPACE_DASHBOARD} />
        <Redirect from={LegacyPath.CANVAS_DIAGRAM} to={LegacyPath.PROJECT_CANVAS} />
        <Redirect from={LegacyPath.CANVAS_PREVIEW} to={LegacyPath.PROJECT_CANVAS} />
        <Redirect from={LegacyPath.CANVAS_TEST} to={Path.PROJECT_PROTOTYPE} />
        <Redirect from={LegacyPath.PROJECT_TEST} to={Path.PROJECT_PROTOTYPE} />
        <Redirect from={LegacyPath.PRODUCT_DETAILS} to={Path.PRODUCT_DETAILS} />
        <Redirect from={LegacyPath.PRODUCT_LIST} to={Path.PRODUCT_LIST} />
        <Redirect from={LegacyPath.TOOLS} to={Path.PROJECT_TOOLS} />
        <Redirect from={LegacyPath.PUBLISH_GOOGLE} to={Path.PUBLISH_GOOGLE} />
        <Redirect from={LegacyPath.PUBLISH_ALEXA} to={Path.PUBLISH_ALEXA} />
        <Redirect from={LegacyPath.PUBLISH} to={Path.PUBLISH_ALEXA} />
        <Redirect exact from={LegacyPath.PROJECT_PUBLISH} to={Path.PUBLISH_ALEXA} />

        <PrivateRoute path={Path.PROJECT_EXPORT} component={Export} />

        <PrivateRoute path={Path.PROJECT_VERSION} component={Project} />

        <PrivateRoute path={Path.RUNTIME} component={Runtime} />

        <Route
          exact
          path={Path.HOME}
          render={() =>
            authToken ? <Redirect to={`${Path.DASHBOARD}${window.location.search}`} /> : <Redirect to={`${Path.SIGNUP}${window.location.search}`} />
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
