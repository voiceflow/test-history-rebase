import queryString from 'query-string';
import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { FullSpinner } from '@/components/Spinner';
import { FeatureFlag } from '@/config/features';
import { authTokenSelector } from '@/ducks/session';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import Onboarding from '@/pages/Onboarding';
import OnboardingV2 from '@/pages/OnboardingV2';
import LoginForm from '@/pages/Register/LoginForm';
import Reset from '@/pages/Register/Reset';
import ResetPassword from '@/pages/Register/ResetPassword';
import SignupForm from '@/pages/Register/SignupForm';
import { RootRoutes } from '@/utils/routes';

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

const Routes = ({ authToken }) => {
  const onboardingV2 = useFeature(FeatureFlag.ONBOARDING_V2);
  const onboardingV2Enabled = onboardingV2.isEnabled;

  return (
    <Suspense fallback={<FullSpinner name="Assets" />}>
      <Switch>
        <Route exact path="/ssml" component={SSML} />

        <PublicRoute exact path="/reset/:id" name="Reset Password" component={ResetPassword} />
        <PublicRoute exact path="/reset" name="Reset" component={Reset} />
        <PublicRoute exact path="/login" name="Login" page="login" component={LoginForm} />
        <PublicRoute exact path="/signup/promo" name="SignUpPromo" page="signupPromo" component={SignupForm} promo />
        <PublicRoute exact path="/signup" name="SignUp" page="signup" component={SignupForm} />
        <Route exact path="/onboarding" component={onboardingV2Enabled ? OnboardingV2 : Onboarding} />

        <Route exact path={['/creator/terms', '/creator/privacy_policy']} name="Privacy Policy" component={Legal} />

        <Redirect exact from="/workspace" to="/dashboard" />
        <PrivateRoute exact path="/workspace/new" component={NewWorkspace} />
        <PrivateRoute path={['/workspace', '/dashboard']} component={Workspace} />

        <PrivateRoute path="/reference/:project_id" component={Reference} page="canvas" />
        <Route path="/demo/:versionID" component={PublicPrototype} />

        <Redirect from="/team/:team_id?" to="/workspace/:workspaceID?" />
        <Redirect from="/canvas/:versionID/:diagramID?" to={`/${RootRoutes.PROJECT}/:versionID/canvas/:diagramID?`} />
        <Redirect from="/preview/:versionID/:diagramID?" to={`/${RootRoutes.PROJECT}/:versionID/canvas/:diagramID?`} />
        <Redirect from="/test/:versionID/:diagramID?" to={`/${RootRoutes.PROJECT}/:versionID/test/:diagramID?`} />
        <Redirect from={`/${RootRoutes.PROJECT}/:versionID/test/:diagramID?`} to={`/${RootRoutes.PROJECT}/:versionID/prototype/:diagramID?`} />
        <Redirect from="/tools/:versionID/product/:id" to={`/${RootRoutes.PROJECT}/:versionID/tools/product/:id`} />
        <Redirect from="/tools/:versionID/products" to={`/${RootRoutes.PROJECT}/:versionID/tools/products`} />
        <Redirect from="/tools/:versionID" to={`/${RootRoutes.PROJECT}/:versionID/tools`} />
        <Redirect from="/migrate/:versionID" to={`/${RootRoutes.PROJECT}/:versionID/migrate`} />
        <Redirect from="/publish/:versionID/google" to={`/${RootRoutes.PROJECT}/:versionID/publish/google`} />
        <Redirect from="/publish/:versionID/alexa" to={`/${RootRoutes.PROJECT}/:versionID/publish/alexa`} />
        <Redirect from="/publish/:versionID" to={`/${RootRoutes.PROJECT}/:versionID/publish/alexa`} />
        <Redirect exact from={`/${RootRoutes.PROJECT}/:versionID/publish`} to={`/${RootRoutes.PROJECT}/:versionID/publish/alexa`} />

        <PrivateRoute path={`/${RootRoutes.PROJECT}/:versionID`} component={Skill} />

        <PrivateRoute path="/account" name="Account" component={Account} />

        <Route
          exact
          path="/invite"
          render={(props) => {
            const parsed = queryString.parse(props.location.search);
            const inviteCode = parsed.invite_code;
            const email = parsed.email;
            if (inviteCode) {
              return authToken ? (
                <Redirect to={`/dashboard?invite=${inviteCode}`} />
              ) : (
                <Redirect to={`/signup?invite=${inviteCode}&email=${email}`} />
              );
            }
            const code = props.match.params.invite_code;
            return authToken ? <Redirect to={`/dashboard?invite=${code}`} /> : <Redirect to={`/signup?invite=${code}${props.location.search}`} />;
          }}
        />
        <Route
          exact
          path="/"
          render={() => (authToken ? <Redirect to={`/dashboard${window.location.search}`} /> : <Redirect to={`/signup${window.location.search}`} />)}
        />

        <Route component={Page404} />
      </Switch>
    </Suspense>
  );
};

const mapStateToProps = {
  authToken: authTokenSelector,
};

export default connect(mapStateToProps)(Routes);
