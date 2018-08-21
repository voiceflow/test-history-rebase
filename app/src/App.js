import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthenticationService from './services/Authentication'

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/fontawesome/css/all.min.css';
import './App.css';

// Pages
import StoryBoard from './views/pages/Storyboard/StoryBoard';
import DashBoard from './views/pages/Dashboard/DashBoard';
import Account from './views/pages/Account/Account';
import Admin from './views/pages/Admin/Admin';
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

class App extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <BrowserRouter>
        <div id="body">
          <Route render={(props) => {
            return (<NavBar {...props}/>)
          }} />
          <Switch>
            <Route exact path="/login" name="Login" component={Account} />
            <Route exact path="/signup" name="SignUp" component={Account} />
            <PrivateRoute path="/storyboard" name="Storyboard" component={StoryBoard} />
            <PrivateRoute path="/storyboard/:id" name="Storyboard" component={StoryBoard} />
            <PrivateRoute path="/dashboard" name="Dashboard" component={DashBoard} />
            <PrivateRoute path="/admin" name="Admin" component={Admin} />
            <Route exact path="/" render={() => (
              AuthenticationService.isAuth() ? (
                <Redirect to="/storyboard"/>
              ) : (
                <Redirect to="/login"/>
              )
            )}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
