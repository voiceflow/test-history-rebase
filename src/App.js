import React, { Component } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import AuthenticationService from './services/Authentication';
import ReactGA from 'react-ga';
import { createBrowserHistory } from 'history';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/fontawesome/css/all.min.css';
import './App.css';

// Pages
import StoryBoard from './views/pages/Storyboard';
import DashBoard from './views/pages/Dashboard';
import Business from './views/pages/Business';
import Account from './views/pages/Account';
import NavBar from './views/components/NavBar';
import Skill from './views/pages/Skill'
import Marketplace from './views/pages/Marketplace/Marketplace';
import ModulePage from './views/pages/Marketplace/ModulePage';
import PublishMarket from './views/pages/PublishMarket/PublishMarket.js';

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

ReactGA.initialize('UA-124745244-1');
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
        if(history.location.pathname !== '/login'){
          history.push('/signup');
        }
    }

    history.listen((location, action) => {
      this.setState({
        session: AuthenticationService.isAuth()
      });
    });
  }

  render() {
    // console.log(history.location.pathname);
    return (
      this.state.loading ? 
        <div className='super-center h-100 w-100'>
            <div className="text-center">
                <h1><i className="fas fa-sync-alt fa-spin"/></h1>
                <h5>Loading...</h5>
            </div>
        </div> :
        <Router history={history}>
          <div id="body">
            { this.state.session ? <Route render={(props) => {
                  return <NavBar {...props}/>
            }} /> : null }
              <Switch>
                <PublicRoute exact path="/login" name="Login" component={Account} />
                <PublicRoute exact path="/signup" name="SignUp" component={Account} />
                <PrivateRoute exact path="/storyboard/new" name="Storyboard" new component={StoryBoard}/>
                <PrivateRoute path="/preview/:skill_id/:diagram_id" name="Storyboard" preview component={StoryBoard}/>
                <PrivateRoute path="/storyboard/:skill_id/:diagram_id" name="Storyboard" component={StoryBoard}/>
                <PrivateRoute path="/storyboard" name="Storyboard" component={StoryBoard}/>
                <PrivateRoute path="/business/email/template/:id" name="Business" component={Business} page='template'/>
                <PrivateRoute path="/business/email/templates" name="Business" component={Business} page='email'/>
                <PrivateRoute path="/business" name="Business" component={Business} page='default'/>
                <PrivateRoute path="/dashboard" name="Dashboard" component={DashBoard}/>
                <PrivateRoute path="/publish/amzn/:id" name="Skill Dashboard" component={Skill}/>
                <PrivateRoute path="/publish/market/:id" name="Skill Dashboard" component={PublishMarket}/>
                <PrivateRoute path="/market/:module_id" name="Market" component={ModulePage} />
                <PrivateRoute path="/market" name="Marketplace" component={Marketplace} />
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
