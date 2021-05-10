import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { FullSpinner } from '@/components/Spinner';
import { LegacyPath, Path } from '@/config/routes';
import { authTokenSelector } from '@/ducks/session';
import { connect, lazy } from '@/hocs';
import AdoptSSO from '@/pages/Auth/AdoptSSO';
import Login from '@/pages/Auth/Login';
import LoginSSOCallback from '@/pages/Auth/LoginSSOCallback';
import MattelLogin from '@/pages/Auth/MattelLogin';
import MotorolaLogin from '@/pages/Auth/MotorolaLogin';
import OINLogin from '@/pages/Auth/OINLogin';
import ResetEmail from '@/pages/Auth/ResetEmail';
import ResetPassword from '@/pages/Auth/ResetPassword';
import Signup from '@/pages/Auth/Signup';
import Export from '@/pages/Export';
import Onboarding from '@/pages/Onboarding';
import Settings from '@/pages/Settings';
import { ConnectedProps } from '@/types';
import * as Query from '@/utils/query';

import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const SSML = lazy(() => import('@/pages/SSML'));
const Legal = lazy(() => import('@/components/Legal'));
const Skill = lazy(() => import(/* webpackPrefetch: true */ '@/pages/Skill'));
const Account = lazy(() => import('@/pages/Account'));
const Runtime = lazy(() => import('@/pages/Runtime'));
const Page404 = lazy(() => import('@/components/ErrorPages/404'));
const PublicPrototype = lazy(() => import('@/pages/PublicPrototype'));
const Workspace = lazy(() => import('@/pages/Workspace'));
const NewWorkspace = lazy(() => import('@/pages/Dashboard/NewWorkspace'));

const Routes: React.FC<ConnectedRoutesProps> = ({ authToken }) => (
  <Suspense fallback={<FullSpinner name="Assets" />}>
    <Switch>
      <Route exact path={Path.SSML} component={SSML} />

      <PublicRoute exact path={Path.RESET_PASSWORD} name="Reset Password" component={ResetPassword} />
      <PublicRoute exact path={Path.RESET} name="Reset" component={ResetEmail} />
      <PublicRoute exact path={Path.LOGIN} name="Login" component={Login} />
      <PublicRoute exact path={Path.LOGIN_MATTEL} name="Login - Mattel" component={MattelLogin} />
      <PublicRoute exact path={Path.LOGIN_MOTOROLA} name="Login - Motorola" component={MotorolaLogin} />
      <PublicRoute exact path={Path.LOGIN_OIN} name="Login - OIN" component={OINLogin} />
      <PublicRoute exact path={Path.LOGIN_SSO_CALLBACK} name="Login SSO Callback" component={LoginSSOCallback} />
      <PublicRoute exact path={Path.SSO_ADOPT} name="Adopt SSO" component={AdoptSSO} />
      <PublicRoute exact path={Path.PROMO_SIGNUP} name="SignUpPromo" component={Signup} promo />
      <PublicRoute exact path={Path.SIGNUP} name="SignUp" component={Signup} />
      <PrivateRoute exact path={Path.ONBOARDING} component={Onboarding} />

      <Route exact path={Path.CREATOR_TERMS} name="Privacy Policy" component={Legal} />

      <Redirect exact from={Path.WORKSPACE} to={Path.DASHBOARD} />
      <PrivateRoute exact path={Path.NEW_WORKSPACE} component={NewWorkspace} />
      <PrivateRoute path={[Path.WORKSPACE, Path.DASHBOARD]} component={Workspace} />

      <Redirect exact from={Path.PROJECT_DEMO} to={Path.PUBLIC_PROTOTYPE} />
      <Route path={Path.PUBLIC_PROTOTYPE} component={PublicPrototype} />

      <Redirect from={LegacyPath.WORKSPACE_DASHBOARD} to={Path.WORKSPACE_DASHBOARD} />
      <Redirect from={LegacyPath.CANVAS_DIAGRAM} to={Path.PROJECT_CANVAS} />
      <Redirect from={LegacyPath.CANVAS_PREVIEW} to={Path.PROJECT_CANVAS} />
      <Redirect from={LegacyPath.CANVAS_TEST} to={Path.PROJECT_PROTOTYPE} />
      <Redirect from={LegacyPath.PROJECT_TEST} to={Path.PROJECT_PROTOTYPE} />
      <Redirect from={LegacyPath.PRODUCT_DETAILS} to={Path.PRODUCT_DETAILS} />
      <Redirect from={LegacyPath.PRODUCT_LIST} to={Path.PRODUCT_LIST} />
      <Redirect from={LegacyPath.TOOLS} to={Path.PROJECT_TOOLS} />
      <Redirect from={LegacyPath.MIGRATE} to={Path.PROJECT_MIGRATE} />
      <Redirect from={LegacyPath.PUBLISH_GOOGLE} to={Path.PUBLISH_GOOGLE} />
      <Redirect from={LegacyPath.PUBLISH_ALEXA} to={Path.PUBLISH_ALEXA} />
      <Redirect from={LegacyPath.PUBLISH} to={Path.PUBLISH_ALEXA} />
      <Redirect exact from={LegacyPath.PROJECT_PUBLISH} to={Path.PUBLISH_ALEXA} />

      <PrivateRoute path={Path.PROJECT_EXPORT} component={Export} />
      <PrivateRoute path={Path.PROJECT_SETTINGS} component={Settings} />
      <PrivateRoute path={Path.PROJECT_VERSION} component={Skill} />

      <PrivateRoute path={Path.ACCOUNT} name="Account" component={Account} />
      <PrivateRoute path={Path.RUNTIME} name="Runtime" component={Runtime} />

      <Route
        exact
        path={Path.INVITE}
        render={(props) => {
          const parsed = Query.parse(props.location.search);
          const inviteCode = parsed.invite_code;
          const { email } = parsed;
          const signupLink = email ? `${Path.SIGNUP}?invite=${inviteCode}&email=${email}` : `${Path.SIGNUP}?invite=${inviteCode}`;

          if (inviteCode) {
            return authToken ? <Redirect to={`${Path.DASHBOARD}?invite=${inviteCode}`} /> : <Redirect to={signupLink} />;
          }
          const code = props.match.params.invite_code;
          return authToken ? (
            <Redirect to={`${Path.DASHBOARD}?invite=${code}`} />
          ) : (
            <Redirect to={`${Path.SIGNUP}?invite=${code}${props.location.search}`} />
          );
        }}
      />

      <Route
        exact
        path={Path.HOME}
        render={() =>
          authToken ? <Redirect to={`${Path.DASHBOARD}${window.location.search}`} /> : <Redirect to={`${Path.SIGNUP}${window.location.search}`} />
        }
      />

      <Route component={Page404} />
    </Switch>
  </Suspense>
);

const mapStateToProps = {
  authToken: authTokenSelector,
};

type ConnectedRoutesProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(Routes);
