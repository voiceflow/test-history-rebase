import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { FullSpinner } from '@/components/Spinner';
import { IS_PRODUCTION } from '@/config';
import NewTeam from '@/containers/Dashboard/NewTeam';
import LoginForm from '@/containers/Register/LoginForm';
import SignupForm from '@/containers/Register/SignupForm';
import Reset from '@/containers/Register/reset';
import ResetPassword from '@/containers/Register/resetPassword';
import { authTokenSelector } from '@/ducks/session';
import { connect } from '@/hocs';
import { RootRoutes } from '@/utils/routes';

import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const SSML = React.lazy(() => import('@/containers/SSML'));
const Team = React.lazy(() => import('@/containers/Team'));
const Legal = React.lazy(() => import('@/components/Legal'));
const Skill = React.lazy(() => import('@/containers/Skill'));
const Account = React.lazy(() => import('@/containers/Account'));
const Page404 = React.lazy(() => import('@/components/ErrorPages/404'));
const Designer = React.lazy(() => import('@/containers/Designer'));
const Reference = React.lazy(() => import('@/components/Reference'));
const UserTesting = React.lazy(() => import('@/containers/UserTesting'));

const Routes = ({ authToken }) => (
  <Suspense fallback={<FullSpinner name="Assets" />}>
    <Switch>
      <Route exact path="/ssml" component={SSML} />
      {/* User routes */}
      <PublicRoute exact path="/reset/:id" name="Reset Password" component={ResetPassword} />
      <PublicRoute exact path="/reset" name="Reset" component={Reset} />
      <PublicRoute exact path="/login" name="Login" page="login" component={LoginForm} />
      <PublicRoute exact path="/signup/promo" name="SignUpPromo" page="signupPromo" component={SignupForm} promo />
      <PublicRoute exact path="/signup" name="SignUp" page="signup" component={SignupForm} />

      <Route exact path={['/creator/terms', '/creator/privacy_policy']} name="Privacy Policy" component={Legal} />
      {/* Team routes */}
      <PrivateRoute exact path="/team/new" component={NewTeam} />
      <PrivateRoute path={['/team', '/dashboard', '/onboarding']} component={Team} />
      {/* Designer Routes */}
      {!IS_PRODUCTION && <Route path="/designer/preview" component={Designer} />}
      {/* Canvas Routes */}
      <PrivateRoute path="/reference/:project_id" component={Reference} page="canvas" />
      <Route path="/demo/:versionID" component={UserTesting} />

      {/* Skill old-routes redirects */}
      <Redirect from="/canvas/:versionID/:diagramID?" to={`/${RootRoutes.PROJECT}/:versionID/canvas/:diagramID?`} />
      <Redirect from="/preview/:versionID/:diagramID?" to={`/${RootRoutes.PROJECT}/:versionID/canvas/:diagramID?`} />
      <Redirect from="/test/:versionID/:diagramID?" to={`/${RootRoutes.PROJECT}/:versionID/test/:diagramID?`} />
      <Redirect from="/tools/:versionID/product/:id" to={`/${RootRoutes.PROJECT}/:versionID/tools/product/:id`} />
      <Redirect from="/tools/:versionID/products" to={`/${RootRoutes.PROJECT}/:versionID/tools/products`} />
      <Redirect from="/tools/:versionID" to={`/${RootRoutes.PROJECT}/:versionID/tools`} />
      <Redirect from="/migrate/:versionID" to={`/${RootRoutes.PROJECT}/:versionID/migrate`} />
      <Redirect from="/visuals/:versionID/display/:id" to={`/${RootRoutes.PROJECT}/:versionID/visuals/:id`} />
      <Redirect from="/visuals/:versionID" to={`/${RootRoutes.PROJECT}/:versionID/visuals`} />
      <Redirect from="/publish/:versionID/google" to={`/${RootRoutes.PROJECT}/:versionID/publish/google`} />
      <Redirect from="/publish/:versionID/alexa" to={`/${RootRoutes.PROJECT}/:versionID/publish/alexa`} />
      <Redirect from="/publish/:versionID" to={`/${RootRoutes.PROJECT}/:versionID/publish/alexa`} />
      <Redirect exact from={`/${RootRoutes.PROJECT}/:versionID/publish`} to={`/${RootRoutes.PROJECT}/:versionID/publish/alexa`} />
      <Redirect from="/creator_logs/:versionID" to={`/${RootRoutes.PROJECT}/:versionID/creator_logs`} />
      {/* Skill route */}
      <PrivateRoute path={`/${RootRoutes.PROJECT}/:versionID`} component={Skill} />

      <PrivateRoute path="/account" name="Account" component={Account} />

      <Route
        exact
        path="/invite/:invite_code"
        render={(props) => {
          const code = props.match.params.invite_code;
          return authToken ? <Redirect to={`/dashboard?invite=${code}`} /> : <Redirect to={`/signup?invite=${code}${props.location.search}`} />;
        }}
      />
      <Route exact path="/" render={() => (authToken ? <Redirect to="/dashboard" /> : <Redirect to="/signup" />)} />
      {/* Warning Routes */}
      <Route component={Page404} />
    </Switch>
  </Suspense>
);

const mapStateToProps = {
  authToken: authTokenSelector,
};

export default connect(mapStateToProps)(Routes);
