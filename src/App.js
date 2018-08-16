import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import AuthenticationService from './services/Authentication'

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/fontawesome/css/all.min.css';

// Pages
import StoryBoard from './views/pages/StoryBoard/StoryBoard';
import Account from './views/pages/Account/Account';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    !AuthenticationService.isAuth() ? (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    ) : (
      <Component {...props}/>
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
          <PrivateRoute path="/" name="StoryBoard" component={StoryBoard} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
