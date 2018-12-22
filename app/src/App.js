import React, { Component } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import AuthenticationService from './services/Authentication';
import ReactGA from 'react-ga';
import { createBrowserHistory } from 'history';
import {StripeProvider} from 'react-stripe-elements'

// Import Dependent CSS
import 'react-tippy/dist/tippy.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/fontawesome/css/all.min.css';
import './App.css';

// Pages
import Account from './views/pages/Account';
import Canvas from './views/pages/Canvas';
import DashBoard from './views/pages/Dashboard';
import Business from './views/pages/Business';
import Register from './views/pages/Register';
import Reset from './views/pages/Register/reset';
import ResetPassword from './views/pages/Register/resetPassword';
import NavBar from './views/components/NavBar';
import Skill from './views/pages/Skill';
import Marketplace from './views/pages/Marketplace/Marketplace';
import ModulePage from './views/pages/Marketplace/ModulePage';
import PublishMarket from './views/pages/PublishMarket/PublishMarket.js';
import Onboarding from './views/pages/Onboarding';
import ModuleAdminPage from './views/pages/ModuleAdminPage';

// SECRET
var STRIPE_KEY
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  STRIPE_KEY = 'pk_test_G3o7CC0pvrW2cIbIU1bLkMSR'
}else{
  STRIPE_KEY = 'pk_live_9QXjJjWc0sjk8VSwbQT3viub'
}

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
      <Component {...props} {...rest} name={Name} />
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
      session: false,
      stripe: null
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
      this.setState({
        session: AuthenticationService.isAuth()
      });
    });
  }

  componentDidMount() {
    if (window.Stripe) {
      this.setState({stripe: window.Stripe(STRIPE_KEY)});
    } else {
      document.querySelector('#stripe-js').addEventListener('load', () => {
        // Create Stripe instance once Stripe.js loads
        this.setState({stripe: window.Stripe(STRIPE_KEY)});
      });
    }
  }

  render() {
    if(this.state.loading){
      return <div className='super-center h-100 w-100'>
          <div className="text-center">
              <h5 className="pb-3">Loading</h5>
              <h1><span className="loader"/></h1>
          </div>
      </div>
    }

    return (
      <StripeProvider stripe={this.state.stripe}>
        <Router history={history}>
          <div id="body">
            { (this.state.session && history.location.pathname !== '/onboarding') && <Route render={(props) => {
                  return <NavBar {...props}/>
            }} /> }
              <Switch>
                <PublicRoute exact path="/reset/:id" name="Reset Password" component={ResetPassword} />
                <PublicRoute exact path="/reset" name="Reset" component={Reset} />
                <PublicRoute exact path="/login" name="Login" login component={Register} />
                <PublicRoute exact path="/signup" name="SignUp" component={Register} />
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
                <PrivateRoute path="/stuff" name="Certification" component={ModuleAdminPage} />
                <PrivateRoute path="/account" name="Account" component={Account} />
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
      </StripeProvider>
    );
  }
}

export default App;
