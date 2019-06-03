import React from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';

import ResetPassword from 'containers/Register/resetPassword';
import Reset from 'containers/Register/reset';
import Register from 'containers/Register';
import Team from '../Team';
import NewTeam from 'containers/Dashboard/NewTeam';
import Skill from '../Skill';
import Admin from 'containers/Admin';
// import ModuleAdminPage from 'containers/ModuleAdminPage';
import Account from 'containers/Account';
import {getAuth} from '../ducks/account';
import Page404 from 'components/404';
import Legal from 'components/Legal';


import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const allRoutes = (
  <Switch>
    {/* User routes */}
    <PublicRoute exact path="/reset/:id" name="Reset Password" component={ResetPassword}/>
    <PublicRoute exact path="/reset" name="Reset" component={Reset}/>
    <PublicRoute exact path="/login" name="Login" page="login" component={Register}/>
    <PublicRoute exact path="/signup" name="SignUp" page="signup" component={Register}/>
    <Route exact path="/creator/privacy_policy" name="Privacy Policy" component={Legal}/>
    <Route exact path="/creator/terms" name="Terms" component={Legal}/>

    {/* Team routes */}
    <PrivateRoute path="/dashboard" name="Dashboard" component={Team}/>
    <PrivateRoute exact path="/team/new" component={NewTeam}/>
    <PrivateRoute exact path="/team/template/:board_id" component={Team} page="template"/>
    <PrivateRoute exact path="/team/template" component={Team} page="template"/>
    <PrivateRoute exact path="/team/:team_id" component={Team}/>
    <PrivateRoute exact path="/onboarding" component={Team} page="onboarding"/>
    {/* Canvas Routes */}
    <PrivateRoute path="/preview/:skill_id/:diagram_id" component={Skill} page="canvas" preview/>
    <PrivateRoute path="/preview/:skill_id" component={Skill} page="canvas" preview/>
    <PrivateRoute path="/canvas/:skill_id/:diagram_id" component={Skill} page="canvas"/>
    <PrivateRoute path="/canvas/:skill_id" component={Skill} page="canvas"/>
    {/* Business routes */}
    <PrivateRoute path="/tools/:skill_id/link_account/templates" component={Skill} page="tools"
                  secondaryPage="link_account"/>
    <PrivateRoute path="/tools/:skill_id/product/:id" component={Skill} page="tools" secondaryPage="product"/>
    <PrivateRoute path="/tools/:skill_id/products" component={Skill} page="tools" secondaryPage="products"/>
    <PrivateRoute path="/tools/:skill_id" component={Skill} page='tools' secondaryPage="home"/>
    {/* Settings routes */}
    <PrivateRoute path="/settings/:skill_id/discovery/canfulfill/:id" component={Skill} page='settings'
                  secondaryPage="discovery"/>
    <PrivateRoute path="/settings/:skill_id/discovery/" component={Skill} page='settings' secondaryPage="discovery"/>
    <PrivateRoute path="/settings/:skill_id/basic/" component={Skill} page='settings' secondaryPage="basic"/>
    <PrivateRoute path="/settings/:skill_id/advanced/" component={Skill} page='settings' secondaryPage="advanced"/>
    <PrivateRoute path="/settings/:skill_id/backups/" component={Skill} page='settings' secondaryPage="backups"/>
    <PrivateRoute path="/migrate/:skill_id" component={Skill} page='migrate'/>
    {/* Admin routes */}
    <PrivateRoute path="/visuals/:skill_id/display/:id" component={Skill} page='visuals' secondaryPage="display"/>
    <PrivateRoute path="/visuals/:skill_id" component={Skill} page='visuals' secondaryPage="displays"/>
    <PrivateRoute path="/admin/updates" name="Admin" component={Admin} page='updates'/>
    <PrivateRoute path="/admin/copy" name="Admin" component={Admin} page='copy'/>
    <PrivateRoute path="/admin/lookup/:version_id" name="Admin" component={Admin} page='lookup'/>
    <PrivateRoute path="/admin/lookup" name="Admin" component={Admin} page='lookup'/>
    <PrivateRoute path="/admin/version/:version_id" name="Admin" component={Admin} page='default'/>
    <PrivateRoute path="/admin" name="Admin" component={Admin} page='default'/>
    <PrivateRoute path="/publish/:skill_id/google" component={Skill} page="publish" secondaryPage="google"/>
    <PrivateRoute path="/publish/:skill_id/alexa" component={Skill} page="publish" secondaryPage="alexa"/>
    <PrivateRoute path="/publish/:skill_id" component={Skill} page="publish" secondaryPage="alexa"/>
    <PrivateRoute path="/account/upgrade" name="Account" component={Account} upgrade/>
    <PrivateRoute path="/account" name="Account" component={Account}/>\
    <PrivateRoute path="/creator_logs/:skill_id" component={Skill} page="logs"/>
    <Route exact path="/invite/:invite_code" render={props => {
      const code = props.match.params.invite_code;
      return (
        getAuth() ?
          <Redirect to={`/dashboard?invite=${code}`}/> :
          <Redirect to={`/signup?invite=${code}${props.location.search}`}/>
      );
    }}
    />
    <Route exact path="/" render={() => (
      getAuth() ?
        <Redirect to="/dashboard"/> :
        <Redirect to="/signup"/>
    )}/>
    {/* Warning Routes */}
    <Route component={Page404}/>
  </Switch>
);

export default allRoutes;
