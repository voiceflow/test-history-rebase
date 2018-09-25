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
      loading: AuthenticationService.isAuth()
    }

    if(AuthenticationService.isAuth()){
        AuthenticationService.check((err, res) => {
            if (err) {
                history.push('/login');
            } else {
                this.setState({ 
                  loading: false 
                });
            }
        });
    }else{
        history.push('/login');
    }
  }

  componentDidMount() {

  }

  render() {
    let routes = this.state.loading ? 
    <div className='super-center h-100 w-100'>
        <div className="text-center">
            <h1><i className="fas fa-sync-alt fa-spin mb-3"/></h1>
            <hr/>
            <h5>Loading Login Information</h5>
        </div>
    </div> :
    <div>
      <NavBar intercom history={history} location={{pathname:'yeboi'}}/>
      <PrivateRoute path="/storyboard" name="Storyboard" component={StoryBoard} />
      <PrivateRoute path="/storyboard/:id" name="Storyboard" component={StoryBoard} />
      <PrivateRoute path="/storyboard/review/:id" name="Storyboard" component={StoryBoard} />
      <PrivateRoute path="/dashboard" name="Dashboard" component={DashBoard} />
      <PrivateRoute path="/admin" name="Admin" component={Admin} />
      <PrivateRoute path="/reviews" name="Reviews" component={Reviews} />
      <PrivateRoute path="/analytics" name="Analytics" component={Analytics} />
    </div>

    return (
      <Router history={history}>
        <div id="body">
          <Switch>
            <Route exact path="/login" name="Login" component={Account} />
            <Route exact path="/signup" name="SignUp" component={Account} />
            <Route exact path="/" render={() => (
              AuthenticationService.isAuth() ? (
                <Redirect to="/storyboard"/>
              ) : (
                <Redirect to="/login"/>
              )
            )}/>
            {routes}
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
