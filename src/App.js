import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import auth from './services/Authentication'

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/fontawesome/css/all.min.css';

// Pages
import { StoryBoard, Login } from './views/pages';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    !auth.isAuth() ? (
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
          <Route exact path="/login" name="Login Page" component={Login} />
          <PrivateRoute path="/" name="StoryBoard Page" component={StoryBoard} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
