import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthenticationService from './services/Authentication'

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/fontawesome/css/all.min.css';
import './App.css';

// Pages
import StoryBoard from './views/pages/StoryBoard/StoryBoard';
import Account from './views/pages/Account/Account';
import Admin from './views/pages/Admin/Admin';

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

class App extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/login" name="Login" component={Account} />
          <Route exact path="/signup" name="SignUp" component={Account} />
          <PrivateRoute path="/storyboard" name="StoryBoard" component={StoryBoard} />
          <PrivateRoute path="/admin" name="Admin" component={Admin} />
          <PrivateRoute path="/" name="StoryBoard" component={StoryBoard} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
