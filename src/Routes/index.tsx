import queryString from 'query-string';
import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { FullSpinner } from '@/components/Spinner';
import { LegacyPath, Path } from '@/config/routes';
import { authTokenSelector } from '@/ducks/session';
import { connect } from '@/hocs';
import Export from '@/pages/Export';
import Onboarding from '@/pages/Onboarding';
import LoginForm from '@/pages/Register/LoginForm';
import Reset from '@/pages/Register/Reset';
import ResetPassword from '@/pages/Register/ResetPassword';
import SignupForm from '@/pages/Register/SignupForm';
import Settings from '@/pages/Settings';
import { ConnectedProps } from '@/types';

import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const SSML = React.lazy(() => import('@/pages/SSML'));
const Legal = React.lazy(() => import('@/components/Legal'));
const Skill = React.lazy(() => import('@/pages/Skill'));
const Account = React.lazy(() => import('@/pages/Account'));
const Page404 = React.lazy(() => import('@/components/ErrorPages/404'));
const Reference = React.lazy(() => import('@/components/Reference'));
const PublicPrototype = React.lazy(() => import('@/pages/PublicPrototype'));
const Workspace = React.lazy(() => import('@/pages/Workspace'));
const NewWorkspace = React.lazy(() => import('@/pages/Dashboard/NewWorkspace'));

const Routes: React.FC<ConnectedRoutesProps> = ({ authToken }) => {
  return (
    <Suspense fallback={<FullSpinner name="Assets" />}>
      <Switch>
        <Route exact path={Path.SSML} component={SSML} />

        <PublicRoute exact path={Path.RESET_PASSWORD} name="Reset Password" component={ResetPassword} />
        <PublicRoute exact path={Path.RESET} name="Reset" component={Reset} />
        <PublicRoute exact path={Path.LOGIN} name="Login" component={LoginForm} />
        <PublicRoute exact path={Path.PROMO_SIGNUP} name="SignUpPromo" component={SignupForm} promo />
        <PublicRoute exact path={Path.SIGNUP} name="SignUp" component={SignupForm} />
        <Route exact path={Path.ONBOARDING} component={Onboarding} />

        <Route exact path={Path.CREATOR_TERMS} name="Privacy Policy" component={Legal} />

        <Redirect exact from={Path.WORKSPACE} to={Path.DASHBOARD} />
        <PrivateRoute exact path={Path.NEW_WORKSPACE} component={NewWorkspace} />
        <PrivateRoute path={[Path.WORKSPACE, Path.DASHBOARD]} component={Workspace} />

        <PrivateRoute path={Path.PROJECT_REFERENCE} component={Reference} page="canvas" />
        <Route path={Path.PROJECT_DEMO} component={PublicPrototype} />

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

        <PrivateRoute path={LegacyPath.PROJECT_EXPORT} component={Export} />
        <PrivateRoute path={Path.PROJECT_SETTINGS} component={Settings} />
        <PrivateRoute path={LegacyPath.PROJECT_VERSION} component={Skill} />

        <PrivateRoute path={Path.ACCOUNT} name="Account" component={Account} />

        <Route
          exact
          path={Path.INVITE}
          render={(props) => {
            const parsed = queryString.parse(props.location.search);
            const inviteCode = parsed.invite_code;
            const email = parsed.email;
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
};

const mapStateToProps = {
  authToken: authTokenSelector,
};

type ConnectedRoutesProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(Routes);
