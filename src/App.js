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
import StoryBoard from './views/pages/Storyboard/StoryBoard';
import OldDashBoard from './views/pages/Dashboard/OldDashBoard';
import DashBoard from './views/pages/Dashboard/DashBoard';
import Account from './views/pages/Account/Account';
import Admin from './views/pages/Admin/Admin';
import Reviews from './views/pages/Reviews/Reviews';
import Analytics from './views/pages/Analytics/Analytics';
import NavBar from './views/components/NavBar/NavBar'

const PrivateRoute = ({ component: Component, name: Name, ...rest }) => (
  <Route {...rest} render={props => (
    !AuthenticationService.isAuth() ? (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    ) : (
      <Component {...props} name={Name} />
    )
  )}/>
)

const PublicRoute = ({ component: Component, name: Name, ...rest }) => (
  <Route {...rest} render={props => (
    AuthenticationService.isAuth() ? (
      <Redirect to={{
        pathname: '/storyboard',
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
                history.push('/login');
            } else {
                this.setState({ 
                  loading: false,
                  session: true
                });
            }
        });
    }else{
        history.push('/login');
    }

    history.listen((location, action) => {
      this.setState({
        session: AuthenticationService.isAuth()
      });
    })
  }

  render() {
    return (
      this.state.loading ? 
        <div className='super-center h-100 w-100'>
            <div className="text-center">
                <h1><img className="fa-spin" src='/sync.svg' height='42' width='42' alt='loading'/></h1>
                <h5>Loading...</h5>
            </div>
        </div> :
        <Router history={history}>
          <div id="body">
            { this.state.session ? <Route render={(props) => {
                  return <NavBar intercom {...props}/>
            }} /> : null }
              <Switch>
                <PublicRoute exact path="/login" name="Login" component={Account} />
                <PublicRoute exact path="/signup" name="SignUp" component={Account} />
                <PrivateRoute path="/storyboard" name="Storyboard" component={StoryBoard} />
                <PrivateRoute path="/storyboard/:id" name="Storyboard" component={StoryBoard} />
                <PrivateRoute path="/storyboard/review/:id" name="Storyboard" component={StoryBoard} />
                <PrivateRoute path="/dashboard" name="Dashboard" component={DashBoard} />
                <PrivateRoute path="/olddashboard" name="Dashboard" component={OldDashBoard} />
                <PrivateRoute path="/admin" name="Admin" component={Admin} />
                <PrivateRoute path="/reviews" name="Reviews" component={Reviews} />
                <PrivateRoute path="/analytics" name="Analytics" component={Analytics} />
                <Route exact path="/" render={() => (
                  AuthenticationService.isAuth() ? (
                    <Redirect to="/dashboard"/>
                  ) : (
                    <Redirect to="/login"/>
                  )
                )}/>
              </Switch>
          </div>
        </Router>
    );
  }
}

export default App;
