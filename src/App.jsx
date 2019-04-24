import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import ReactGA from "react-ga";
import { store, history } from "./containers/store";
import { Alert } from "reactstrap";
import { ConnectedRouter } from 'connected-react-router'
import { DragDropContext } from "react-dnd";
import DragDropBackend from "./services/DragDropBackend";

// Import Dependent CSS
import "react-tippy/dist/tippy.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/fontawesome/css/all.min.css";
import "./App.css";
import "react-day-picker/lib/style.css";

// Pages
import Skill from './Skill'
import Team from './Team'
import Account from './views/pages/Account';
import Admin from './views/pages/Admin';
import Register from './views/pages/Register';
import Reset from './views/pages/Register/reset';
import ResetPassword from './views/pages/Register/resetPassword';
import NavBar from './views/components/NavBar';
// import Marketplace from './views/pages/Marketplace';
// import ModulePage from './views/pages/Marketplace/ModulePage';
import Page404 from 'views/pages/404'
import ModuleAdminPage from './views/pages/ModuleAdminPage';
import ErrorBoundary from './ErrorBoundary';
import socket from 'socket.io-client'
import {evaluateMaintenance} from './MAINTENANCE'
import NewTeam from './views/pages/Dashboard/NewTeam'

// GLOBAL MODALS
import { setConfirm } from 'ducks/modal'
import ConfirmModal from "./views/components/Modals/ConfirmModal"
import ErrorModal from './views/components/Modals/ErrorModal'
import Modal from 'views/components/Modals/Modal'

import { getAuth, getUser } from 'ducks/account'
import LoginForm from "./views/pages/Register/LoginForm";
import SocialLogin from "./views/pages/Register/SocialLogin";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props =>
      !getAuth() ? (
        <Redirect to={{ 
          pathname: "/login",
          search: props.location.search,
          state: { from: props.location } 
        }}/>
      ) : (
        <ErrorBoundary>
          <Component {...props} {...rest}/>
        </ErrorBoundary>
      )
    }
  />
);

class PublicComponent extends Component {
  shouldComponentUpdate(prevProps) {
    return prevProps.location !== this.props.location
  }

  render() {
    const props = this.props
    return (getAuth() ? (
      <Redirect to={{ 
        pathname: "/dashboard", 
        search: props.location.search,
        state: { from: props.location } 
      }}/>
    ) : (
      <props.component {...props} />
    ))
  }
}

const PublicRoute = ({ component, ...rest }) => (
  <Route {...rest} render={(route_props) => <PublicComponent {...route_props} {...rest} component={component}/>}/>
)

const getEndpoint = () => {
  let port = "";
  let protocol = "https";
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    port = ":8080";
    protocol = "http";
  }
  return `${protocol}://${window.location.hostname}${port}`;
};

const socketFail = () => {
  window.CreatorSocket.status = "FAIL";
};

window.CreatorSocket = socket(getEndpoint());
window.CreatorSocket.connectedCB = {};
// catch error events
window.CreatorSocket.on("fail", socketFail);
window.CreatorSocket.on("error", socketFail);
// to catch if the server is offline
window.CreatorSocket.on("connect_error", socketFail);
// catch failed connection attempts
window.CreatorSocket.on("connect_failed", socketFail);
// to catch connection events
window.CreatorSocket.on("connect", () => {
  window.CreatorSocket.status = "CONNECTED";
  // queued up events after reconnection
  for (var cb in window.CreatorSocket.connectedCB) {
    if (typeof window.CreatorSocket.connectedCB[cb] === "function") {
      window.CreatorSocket.connectedCB[cb]();
    }
  }
});

window.addEventListener("beforeunload", function() {
  if (window.CreatorSocket && window.CreatorSocket.disconnect) {
    window.CreatorSocket.disconnect();
  }
});

ReactGA.initialize("UA-124745244-3");

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: !!getAuth(),
      session: false,
      stripe: null,
    }

    if(this.state.loading){
      store.dispatch(getUser())
      .then(() => this.setState({session: true, loading: false}))
      .catch(err => {
        console.log(err);
        this.setState({ loading: false });
        history.push("/login");
      })
    }

    history.listen((location) => {
      ReactGA.set({ page: location.pathname });
      ReactGA.pageview(location.pathname);
      this.setState({session: !!getAuth()});
    });

    // REDIRECT TO MAINTENANCE
    evaluateMaintenance((time) => {
      if(time){
        setTimeout(() => store.dispatch(setConfirm({
          size: "rg",
          text: <Alert className="mb-0">
            Voiceflow Creator will go under planned maintenance<br/>
            <b>{time}</b> from now<hr/>
            Live Projects will not be affected</Alert>
        })), 100)
      }else{
        window.location.replace('https://getvoiceflow.com/maintenance')
        window.location.href = 'https://getvoiceflow.com/maintenance'
        throw new Error('MAINTENANCE')
      }
    })
  }

  render() {
    if (this.state.loading) {
      return (
        <div id="loading-diagram">
          <div className="text-center">
            <h5 className="text-muted mb-2">Loading Account...</h5>
            <span className="loader" />
          </div>
        </div>
      );
    }
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
        <div id="body">
          <ConfirmModal/>
          <ErrorModal />
          <Modal />
            {(this.state.session && history.location.pathname !== '/onboarding') && <NavBar history={history}/>}
              <Switch>
                {/* User routes */}
                <Route exact path="/loginform" component={SocialLogin} />
                <PublicRoute exact path="/reset/:id" name="Reset Password" component={ResetPassword} />
                <PublicRoute exact path="/reset" name="Reset" component={Reset} />
                <PublicRoute exact path="/login" name="Login" page="login" component={Register} />
                <PublicRoute exact path="/signup" name="SignUp" page="signup" component={Register} />                
                {/* Team routes */}
                <PrivateRoute path="/dashboard" name="Dashboard" component={Team}/>
                <PrivateRoute exact path="/team/new" component={NewTeam}/>
                <PrivateRoute exact path="/team/template" component={Team} page="template"/>
                <PrivateRoute exact path="/team/:team_id" component={Team}/>
                <PrivateRoute exact path="/onboarding" component={Team} page="onboarding"/>
                {/* Canvas Routes */}
                <PrivateRoute path="/preview/:skill_id/:diagram_id" component={Skill} page="canvas" preview/>
                <PrivateRoute path="/canvas/:skill_id/:diagram_id" component={Skill} page="canvas"/>
                <PrivateRoute path="/canvas/:skill_id" component={Skill} page="canvas"/>
                {/* Business routes */}
                <PrivateRoute path="/tools/:skill_id/link_account/templates" component={Skill} page="tools" secondaryPage="link_account"/>
                <PrivateRoute path="/tools/:skill_id/email/:id" component={Skill} page="tools" secondaryPage="email"/>
                <PrivateRoute path="/tools/:skill_id/emails" component={Skill} page="tools" secondaryPage="emails"/>
                <PrivateRoute path="/tools/:skill_id/product/:id" component={Skill} page="tools" secondaryPage="product"/>
                <PrivateRoute path="/tools/:skill_id/products" component={Skill} page="tools" secondaryPage="products"/>
                <PrivateRoute path="/tools/:skill_id" component={Skill} page='tools' secondaryPage="home"/>
                {/* Settings routes */}
                <PrivateRoute path="/settings/:skill_id/discovery/canfulfill/:id" component={Skill} page='settings' secondaryPage="discovery"/>
                <PrivateRoute path="/settings/:skill_id/discovery/" component={Skill} page='settings' secondaryPage="discovery"/>
                <PrivateRoute path="/settings/:skill_id/basic/" component={Skill} page='settings' secondaryPage="basic"/>
                <PrivateRoute path="/settings/:skill_id/advanced/" component={Skill} page='settings' secondaryPage="advanced"/>
                <PrivateRoute path="/settings/:skill_id/backups/" component={Skill} page='settings' secondaryPage="backups"/>
                {/* Admin routes */}
                <PrivateRoute path="/visuals/:skill_id/display/:id" component={Skill} page='visuals' secondaryPage="display"/>
                <PrivateRoute path="/visuals/:skill_id" component={Skill} page='visuals' secondaryPage="displays"/>
                <PrivateRoute path="/admin/updates" name="Admin" component={Admin} page='updates'/>
                <PrivateRoute path="/admin/copy" name="Admin" component={Admin} page='copy'/>
                <PrivateRoute path="/admin" name="Admin" component={Admin} page='default'/>
                <PrivateRoute path="/publish/:skill_id/google" component={Skill} onConfirm={this.onConfirm} page="publish" secondaryPage="google"/>
                <PrivateRoute path="/publish/:skill_id/alexa" component={Skill} onConfirm={this.onConfirm} page="publish" secondaryPage="alexa"/>
                <PrivateRoute path="/publish/:skill_id/market" component={Skill} onConfirm={this.onConfirm} page="publish" secondaryPage="market"/>
                <PrivateRoute path="/publish/:skill_id" component={Skill} onConfirm={this.onConfirm} page="publish" secondaryPage="alexa"/>
                {/* <PrivateRoute path="/market/:skill_id/:module_id" component={Skill} secondary={ModulePage} /> */}
                <PrivateRoute path="/market/:skill_id/flows" name="Market" component={Skill} onConfirm={this.onConfirm} page="market" secondaryPage="flows"/>
                <PrivateRoute path="/market/:skill_id/templates" name="Market" component={Skill} onConfirm={this.onConfirm} page="market" secondaryPage="templates"/>
                <PrivateRoute path="/market/:skill_id" name="Market" component={Skill} onConfirm={this.onConfirm} page="market" secondaryPage="flows"/>
                <PrivateRoute path="/stuff" name="Certification" component={ModuleAdminPage} />
                <PrivateRoute path="/account/upgrade" name="Account" component={Account} upgrade/>
                <PrivateRoute path="/account" name="Account" component={Account} />\
                <PrivateRoute path="/creator_logs/:skill_id" component={Skill} page="logs"/>
                <Route exact path="/invite/:invite_code" render={props => {
                  const code = props.match.params.invite_code
                  return (
                    getAuth() ? 
                      <Redirect to={`/dashboard?invite=${code}`}/> : 
                      <Redirect to={`/signup?invite=${code}${props.location.search}`}/>
                  )}}
                />
                <Route exact path="/" render={() => (
                  getAuth() ?
                    <Redirect to="/dashboard" /> :
                    <Redirect to="/signup" />
                )}/>
              {/* Warning Routes */}
              <Route component={Page404} />
            </Switch>
          </div>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default DragDropContext(DragDropBackend)(App);
