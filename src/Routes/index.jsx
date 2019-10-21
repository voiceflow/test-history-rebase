import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Page404 from '@/components/ErrorPages/404';
import Legal from '@/components/Legal';
import Reference from '@/components/Reference';
import { IS_PRODUCTION } from '@/config';
import Account from '@/containers/Account';
import NewTeam from '@/containers/Dashboard/NewTeam';
import Designer from '@/containers/Designer';
import LoginForm from '@/containers/Register/LoginForm';
import SignupForm from '@/containers/Register/SignupForm';
import Reset from '@/containers/Register/reset';
import ResetPassword from '@/containers/Register/resetPassword';
import SSML from '@/containers/SSML';
import Skill from '@/containers/Skill';
import UserTesting from '@/containers/UserTesting';
import { authTokenSelector } from '@/ducks/session';
import { connect } from '@/hocs';

import Team from '../Team';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const Routes = ({ authToken }) => (
  <Switch>
    <Route exact path="/ssml" component={SSML} />
    {/* User routes */}
    <PublicRoute exact path="/reset/:id" name="Reset Password" component={ResetPassword} />
    <PublicRoute exact path="/reset" name="Reset" component={Reset} />
    <PublicRoute exact path="/login" name="Login" page="login" component={LoginForm} />
    <PublicRoute exact path="/signup/promo" name="SignUpPromo" page="signupPromo" component={SignupForm} promo />
    <PublicRoute exact path="/signup" name="SignUp" page="signup" component={SignupForm} />
    <Route exact path="/creator/privacy_policy" name="Privacy Policy" component={Legal} />
    <Route exact path="/creator/terms" name="Terms" component={Legal} />
    {/* Team routes */}
    <PrivateRoute path="/dashboard" name="Dashboard" component={Team} />
    <PrivateRoute exact path="/team/new" component={NewTeam} />
    <PrivateRoute exact path="/team/template/:board_id" component={Team} page="template" />
    <PrivateRoute exact path="/team/template" component={Team} page="template" />
    <PrivateRoute exact path="/team/:team_id" component={Team} />
    <PrivateRoute exact path="/onboarding" component={Team} page="onboarding" />
    {/* Canvas Routes */}
    <PrivateRoute path="/preview/:skill_id/:diagram_id?" component={Skill} page="canvas" preview />
    <PrivateRoute path="/canvas/:skill_id/:diagram_id?" component={Skill} page="canvas" />
    <PrivateRoute path="/reference/:project_id" component={Reference} page="canvas" />
    {/* Designer Routes */}
    {!IS_PRODUCTION && <Route path="/designer/preview" component={Designer} />}
    {/* Testing routes */}
    <PrivateRoute path="/test/:skill_id/:diagram_id?" component={Skill} page="test" />
    <Route path="/demo/:skill_id" component={UserTesting} />
    {/* Business routes */}
    {/* TODO: check w/ someone */}
    {/* <PrivateRoute path="/tools/:skill_id/link_account/templates" component={Skill} page="tools" secondaryPage="link_account" /> */}
    <PrivateRoute path="/tools/:skill_id/product/:id" component={Skill} page="tools" secondaryPage="product" />
    <PrivateRoute path="/tools/:skill_id/products" component={Skill} page="tools" secondaryPage="products" />
    <PrivateRoute path="/tools/:skill_id" component={Skill} page="tools" secondaryPage="home" />
    {/* Settings routes */}
    {/* TODO: investigate */}
    <PrivateRoute path="/migrate/:skill_id" component={Skill} page="migrate" />
    {/* Admin routes */}
    <PrivateRoute path="/visuals/:skill_id/display/:id" component={Skill} page="visuals" secondaryPage="display" />
    <PrivateRoute path="/visuals/:skill_id" component={Skill} page="visuals" secondaryPage="displays" />
    <PrivateRoute path="/publish/:skill_id/google" component={Skill} page="publish" secondaryPage="google" />
    <PrivateRoute path="/publish/:skill_id/alexa" component={Skill} page="publish" secondaryPage="alexa" />
    <PrivateRoute path="/publish/:skill_id" component={Skill} page="publish" secondaryPage="alexa" />
    <PrivateRoute path="/account/upgrade" name="Account" component={Account} upgrade />
    <PrivateRoute path="/account" name="Account" component={Account} />
    <PrivateRoute path="/creator_logs/:skill_id" component={Skill} page="logs" />
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
);

const mapStateToProps = {
  authToken: authTokenSelector,
};

export default connect(mapStateToProps)(Routes);
