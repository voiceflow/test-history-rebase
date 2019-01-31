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
import 'react-day-picker/lib/style.css';

// Pages
import Skill from './Skill'
import Account from './views/pages/Account';
import DashBoard from './views/pages/Dashboard';
import Admin from './views/pages/Admin';
import Register from './views/pages/Register';
import Reset from './views/pages/Register/reset';
import ResetPassword from './views/pages/Register/resetPassword';
import NavBar from './views/components/NavBar';
import Marketplace from './views/pages/Marketplace/Marketplace';
import ModulePage from './views/pages/Marketplace/ModulePage';
import Templates from './views/pages/Templates'
import Page404 from 'views/pages/404'
import Onboarding from './views/pages/Onboarding';
import ModuleAdminPage from './views/pages/ModuleAdminPage';
import ErrorScreen from './Error';
import ErrorBoundary from './ErrorBoundary';
import socket from 'socket.io-client'
import {getDevice} from 'Helper'

// SECRET
var STRIPE_KEY
if (process.env.NODE_ENV === 'production') {
  STRIPE_KEY = 'pk_live_9QXjJjWc0sjk8VSwbQT3viub'
}else{
  STRIPE_KEY = 'pk_test_G3o7CC0pvrW2cIbIU1bLkMSR'
}

const PrivateRoute = ({ component: Component, ...rest }) => {
  return <Route {...rest} render={props => (
    !AuthenticationService.isAuth() ? (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    ) : (
      <React.Fragment>
        <ErrorBoundary>
          <Component {...props} {...rest} user={AuthenticationService.getUser()}/>
        </ErrorBoundary>
      </React.Fragment>
    )
  )}/>
}

const getEndpoint = () => {
  let port = ''
  let protocol = 'https'
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    port = ':8080'
    protocol = 'http'
  }
  return `${protocol}://${window.location.hostname}${port}`
}

window.CreatorSocket = socket(getEndpoint())
window.addEventListener('beforeunload', function () {
  if(window.CreatorSocket && window.CreatorSocket.disconnect){
    window.CreatorSocket.disconnect()
  }
})

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

ReactGA.initialize('UA-124745244-3')
const history = createBrowserHistory()

history.listen((location, action) => {
  ReactGA.set({ page: location.pathname })
  ReactGA.pageview(location.pathname)
})

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: AuthenticationService.isAuth(),
      session: false,
      stripe: null,
      error: null
    }

    this.socketFail = this.socketFail.bind(this)

    if(AuthenticationService.isAuth()){
      AuthenticationService.check((err, res) => {
        if (err) {
          console.log(err)
          this.setState({
            loading: false
          });
          history.push('/login');
        }else{
          window.CreatorSocket.emit('handshake', {
            auth: AuthenticationService.getAuth(),
            device: getDevice()
          }, () => {window.CreatorSocket.status = 'HANDSHAKE'})
          this.setState({session: true})
        }
      })
    }

    history.listen((location, action) => {
      this.setState({
        session: AuthenticationService.isAuth()
      })
    })

    // verified after a handshake
    window.CreatorSocket.on('verified', () => {window.CreatorSocket.status = 'VERIFIED'; this.setState({loading: false})})
    // catch error events
    window.CreatorSocket.on('fail', this.socketFail)
    window.CreatorSocket.on('error', this.socketFail)
    // to catch if the server is offline
    window.CreatorSocket.on('connect_error', this.socketFail)
    // catch failed connection attempts
    window.CreatorSocket.on('connect_failed', this.socketFail)
    // to catch connection events
    window.CreatorSocket.on('connect', () => {
      // attempt to verify again if previously failed already
      if(window.CreatorSocket.status === 'FAIL' && AuthenticationService.isAuth()){
        window.CreatorSocket.emit('handshake', {
          auth: AuthenticationService.getAuth(),
          device: getDevice()
        }, () => {window.CreatorSocket.status = 'HANDSHAKE'})
      }
    })

    window.CreatorSocket.on('in_use', (data) => {
      window.error = true
      this.setState({
        error: {
          type: 'socket-used',
          override: true,
          data: data
        },
        loading: false,
        session: true
      })
    })
  }

  socketFail(){
    window.CreatorSocket.status = 'FAIL'
    // if(AuthenticationService.isAuth() && window.CreatorSocket.status !== 'FAIL'){
    //   window.error = true
    //   window.CreatorSocket.status = 'FAIL'
    //   this.setState({
    //     error: {
    //       type: 'socket-fail',
    //       action: () => {
    //         window.error = false
    //         this.setState({loading: false, error: null})
    //       },
    //     },
    //     loading: false
    //   })
    // }
  }

  componentDidMount() {
    if (window.Stripe) {
      this.setState({stripe: window.Stripe(STRIPE_KEY)});
    } else {
      if (document.querySelector('#stripe-js')) {
        document.querySelector('#stripe-js').addEventListener('load', () => {
          // Create Stripe instance once Stripe.js loads
          this.setState({stripe: window.Stripe(STRIPE_KEY)});
        });
      }
    }
  }

  render() {

    if(this.state.loading){
      return <div id="loading-diagram">
          <div className="text-center">
              <h5 className="text-muted mb-2">Loading Account</h5>
              <span className="loader"/>
          </div>
      </div>
    }

    if(this.state.error && this.state.error.override){
      return <div id="loading-diagram">
        <ErrorScreen error={this.state.error} history={history} close={()=>this.setState({error: null})}/> 
      </div>
    }

    return (
      <StripeProvider stripe={this.state.stripe}>
        <Router history={history}>
          <div id="body">
            { this.state.error && <ErrorScreen error={this.state.error} history={history} close={()=>this.setState({error: null})}/> }
            {(this.state.session && history.location.pathname !== '/onboarding' && history.location.pathname !== '/dashboard') && <Route render={(props) => {
                  return <NavBar {...props}/>
            }} /> }
              <Switch>
                {/* User routes */}
                <PublicRoute exact path="/reset/:id" name="Reset Password" component={ResetPassword} />
                <PublicRoute exact path="/reset" name="Reset" component={Reset} />
                <PublicRoute exact path="/login" name="Login" login component={Register} />
                <PublicRoute exact path="/signup" name="SignUp" component={Register} />
                {/* Template Routes */}
                <PrivateRoute exact path="/templates" component={Templates}/>
                {/* Canvas Routes */}
                <PrivateRoute path="/preview/:skill_id/:diagram_id" component={Skill} page="canvas" preview/>
                <PrivateRoute path="/canvas/:skill_id/:diagram_id" component={Skill} page="canvas"/>
                <PrivateRoute path="/canvas/:skill_id" component={Skill} page="canvas"/>
                {/* Business routes */}
                <PrivateRoute path="/business/:skill_id/link_account/templates" component={Skill} page='business' secondaryPage="link_account"/>
                <PrivateRoute path="/business/:skill_id/email/:id" component={Skill} page='business' secondaryPage="email"/>
                <PrivateRoute path="/business/:skill_id/emails" component={Skill} page='business' secondaryPage="emails"/>
                <PrivateRoute path="/business/:skill_id/product/:id" component={Skill} page="business" secondaryPage="product"/>
                <PrivateRoute path="/business/:skill_id/products" component={Skill} page="business" secondaryPage="products"/>
                <PrivateRoute path="/business/:skill_id" component={Skill} page='business' secondaryPage="home"/>
                {/* Settings routes */}
                <PrivateRoute path="/settings/:skill_id/discovery/canfulfill/:id" component={Skill} page='settings' secondaryPage="discovery"/>
                <PrivateRoute path="/settings/:skill_id/discovery/" component={Skill} page='settings' secondaryPage="discovery"/>
                <PrivateRoute path="/settings/:skill_id/basic/" component={Skill} page='settings' secondaryPage="basic"/>
                <PrivateRoute path="/settings/:skill_id/advanced/" component={Skill} page='settings' secondaryPage="advanced"/>
                <PrivateRoute path="/settings/:skill_id/backups/" component={Skill} page='settings' secondaryPage="backups"/>
                {/* Admin routes */}
                <PrivateRoute path="/visuals/:skill_id/display/:id" component={Skill} page='visuals' secondaryPage="display"/>
                <PrivateRoute path="/visuals/:skill_id" component={Skill} page='visuals' secondaryPage="displays"/>
                <PrivateRoute path="/admin/copy" name="Admin" component={Admin} page='copy'/>
                <PrivateRoute path="/admin" name="Admin" component={Admin} page='default'/>
                <PrivateRoute path="/dashboard" name="Dashboard" component={DashBoard}/>
                <PrivateRoute path="/publish/:skill_id/alexa" component={Skill} page="publish" secondaryPage="alexa"/>
                <PrivateRoute path="/publish/:skill_id/market" component={Skill} page="publish" secondaryPage="market"/>
                <PrivateRoute path="/publish/:skill_id" component={Skill} page="publish" secondaryPage="alexa"/>
                <PrivateRoute path="/market/:module_id" name="Market" component={ModulePage} />
                <PrivateRoute path="/market" name="Marketplace" component={Marketplace} />
                <PrivateRoute path="/onboarding" name="Onboarding" component={Onboarding} />
                <PrivateRoute path="/stuff" name="Certification" component={ModuleAdminPage} />
                <PrivateRoute path="/account" name="Account" component={Account} />
                <PrivateRoute path="/creator_logs/:skill_id" component={Skill} page="logs"/>
                <Route exact path="/" render={() => (
                  AuthenticationService.isAuth() ? (
                    <Redirect to="/dashboard"/>
                  ) : (
                    <Redirect to="/signup"/>
                  )
                )}/>
                {/* Warning Routes */}
                <Route component={Page404}/>
              </Switch>
          </div>
        </Router>
      </StripeProvider>
    );
  }
}

export default App;
