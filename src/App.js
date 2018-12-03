import React, { Component } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import AuthenticationService from './services/Authentication';
import ReactGA from 'react-ga';
import { createBrowserHistory } from 'history';

// Import Dependent CSS
import 'react-tippy/dist/tippy.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/fontawesome/css/all.min.css';
import './App.css';

// Pages
import Canvas from './views/pages/Canvas';
import DashBoard from './views/pages/Dashboard';
import Business from './views/pages/Business';
import Account from './views/pages/Account';
import Reset from './views/pages/Account/reset';
import ResetPassword from './views/pages/Account/resetPassword';
import NavBar from './views/components/NavBar';
import Skill from './views/pages/Skill';
import Marketplace from './views/pages/Marketplace/Marketplace';
import ModulePage from './views/pages/Marketplace/ModulePage';
import PublishMarket from './views/pages/PublishMarket/PublishMarket.js';
import Onboarding from './views/pages/Onboarding';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    !AuthenticationService.isAuth() ? (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    ) : (
      <Component {...props} {...rest} user={AuthenticationService.getUser()}/>
    )
  )}/>
)

const PublicRoute = ({ component: Component, name: Name, ...rest }) => (
  <Route {...rest} render={props => (
    AuthenticationService.isAuth() ? (
      <Redirect to={{
        pathname: '/dashboard',
        state: { from: props.location }
      }}/>
    ) : (
      <Component {...props} name={Name} />
    )
  )}/>
)

ReactGA.initialize('UA-124745244-3');
const history = createBrowserHistory();
history.listen((location, action) => {
  ReactGA.set({ page: location.pathname })
  ReactGA.pageview(location.pathname)
});

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: AuthenticationService.isAuth(),
      session: false
    }

    if(AuthenticationService.isAuth()){
        AuthenticationService.check((err, res) => {
            if (err) {
                this.setState({ 
                  loading: false
                });
                history.push('/login');
            } else {
                this.setState({ 
                  loading: false,
                  session: true
                });
            }
        });
    }else{
        // if(history.location.pathname !== '/login'){
        //   history.push('/signup');
        // }
    }

    history.listen((location, action) => {
      console.log(location);
      this.setState({
        session: AuthenticationService.isAuth()
      });
    });
  }

  render() {
    return (
      this.state.loading ? 
        <div className='super-center h-100 w-100'>
            <div className="text-center">
                <h5 className="pb-3">Loading</h5>
                <h1><span className="loader"/></h1>
            </div>
        </div> :
        <Router history={history}>
          <div id="body">
            { this.state.session  && history.location.pathname !== '/onboarding' ? <Route render={(props) => {
                  return <NavBar {...props}/>
            }} /> : null }
              <Switch>
                <PublicRoute exact path="/reset/:id" name="Reset Password" component={ResetPassword} />
                <PublicRoute exact path="/reset" name="Reset" component={Reset} />
                <PublicRoute exact path="/login" name="Login" component={Account} />
                <PublicRoute exact path="/signup" name="SignUp" component={Account} />
                <PrivateRoute exact path="/canvas/new" name="Canvas" new component={Canvas}/>
                <PrivateRoute path="/preview/:skill_id/:diagram_id" name="Canvas" preview component={Canvas}/>
                <PrivateRoute path="/canvas/:skill_id/:diagram_id" name="Canvas" component={Canvas}/>
                <PrivateRoute path="/canvas" name="Canvas" component={Canvas}/>
                <PrivateRoute path="/business/email/template/:id" name="Business" component={Business} page='template'/>
                <PrivateRoute path="/business/email/templates" name="Business" component={Business} page='email'/>
                <PrivateRoute path="/business" name="Business" component={Business} page='default'/>
                <PrivateRoute path="/dashboard" name="Dashboard" component={DashBoard}/>
                <PrivateRoute path="/publish/amzn/:id" name="Skill Dashboard" component={Skill}/>
                <PrivateRoute path="/publish/market/:id" name="Skill Dashboard" component={PublishMarket}/>
                <PrivateRoute path="/market/:module_id" name="Market" component={ModulePage} />
                <PrivateRoute path="/market" name="Marketplace" component={Marketplace} />
                <PrivateRoute path="/onboarding" name="Onboarding" component={Onboarding} />
                <Route exact path="/" render={() => (
                  AuthenticationService.isAuth() ? (
                    <Redirect to="/dashboard"/>
                  ) : (
                    <Redirect to="/signup"/>
                  )
                )}/>
              </Switch>
          </div>
        </Router>
    );
  }
}

export default App;
