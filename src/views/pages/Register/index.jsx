import React, { Component } from 'react'
import { Form, FormGroup, Input, Alert } from 'reactstrap'
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

import { connect } from 'react-redux'
import { signup, googleLogin, fbLogin, login } from 'ducks/account'
import './Account.css'
import {Link} from 'react-router-dom'
import queryString from 'query-string'
import {googleClient, fbId} from './social-id.js';

class Account extends Component {

  constructor(props) {
    super(props)

    let query = queryString.parse(this.props.location.search)

    this.state = {
      email: "",
      password: "",
      r_name: "",
      r_email: query.email ? query.email : "",
      r_password: "",
      auth_error: null,
      login_error: null,
      signup_error: null,
      login_timeout: null,
      signup_timeout: null,
      auth_timeout: null,
      googleButton: true,
      unverified: false,
    }

    this.openLogin = this.openLogin.bind(this);
    this.openRegister = this.openRegister.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.signupSubmit = this.signupSubmit.bind(this);
    this.loginSubmit = this.loginSubmit.bind(this);
  }

  handleChange = event => {
      this.setState({
        [event.target.name]: event.target.value
      });
    }

  openLogin(e) {
    e.preventDefault();
    this.setState({
      login: true
    });
    this.props.history.push('/login' + this.props.location.search);
    return false;
  }

  openRegister(e) {
    e.preventDefault();
    this.setState({
      login: false
    });
    this.props.history.push('/signup' + this.props.location.search);
    return false;
  }

  signupSubmit(e) {
    e.preventDefault();
    this.props.signup({
      name: this.state.r_name,
      email: this.state.r_email,
      password: this.state.r_password,
      code: this.state.r_code,
    })
    .catch(err => {
      this.setState({
        signup_error: err.response.data
      });
      if(this.signup_timeout){
        clearTimeout(this.signup_timeout)
      }
      this.signup_timeout = setTimeout(function() {
        this.setState({signup_error: false})
      }.bind(this), 5000)
    })
    return false;
  }

  loginSubmit(e) {
    e.preventDefault();
    this.props.login({
      email: this.state.email,
      password: this.state.password,
    })
    .catch(err => {
      this.setState({
        login_error: err && err.response && err.response.data
      });
      if(this.login_timeout){
        clearTimeout(this.login_timeout);
      }
      this.login_timeout = setTimeout(function() {
        this.setState({login_error: false});
      }.bind(this), 5000)
    })
    return false;
  }

  googleLogin = (userProfile) => {
    this.props.googleLogin({
      name: userProfile.profileObj.name,
      email: userProfile.profileObj.email,
      googleId: userProfile.profileObj.googleId,
      token: userProfile.tokenId,
    })
    .catch(err => {
      this.setState({
        auth_error: err.response.data
      });
      if(this.auth_timeout){
        clearTimeout(this.auth_timeout);
      }
      this.auth_timeout = setTimeout(function() {
        this.setState({auth_error: false});
      }.bind(this), 5000)
    })
    return false;
  }

  fbLogin = (fbUser) => {
    this.props.fbLogin({
      name: fbUser.name,
      email: fbUser.email,
      fbId: fbUser.id,
      code: fbUser.accessToken,
      uri: window.location.href,
    })
    .catch(err => {
      this.setState({
        auth_error: err.response.data
      });
      if(this.auth_timeout){
        clearTimeout(this.auth_timeout);
      }
      this.auth_timeout = setTimeout(function() {
        this.setState({auth_error: false});
      }.bind(this), 5000)
    })
    return false;
  }

  render() {
    let login_error;
    if(this.state.login_error){
      login_error = (<Alert color="danger"> {this.state.login_error} </Alert>);
    }
    let signup_error;
    if(this.state.signup_error){
      signup_error = (<Alert color="danger"> {this.state.signup_error} </Alert>);
    }
    let auth_error;
    if(this.state.auth_error){
      auth_error = (<Alert color="danger"> {this.state.auth_error} </Alert>)
    }

    if(this.state.unverified){
      login_error = (
        <Alert color="success">
          Please Verify Your Email to use Facebook Login
        </Alert>);
    }
    return (
      <div className="d-flex flex-row align-items-center justify-content-center" id="main">
        <div className={"login-card " + (this.props.page === 'login' ? null : "open-register")}>
            <div id="side-form">
              <Form id="login-form" onSubmit={this.loginSubmit}>
                <img className="login-logo" src="/logo.svg" alt="logo"/>
                <div className="px-5 pb-5 pt-4">
                  <div className="text-center">
                    <h4 className="mb-4">Login</h4>
                  </div>
                  {auth_error}
                  <div className="social-login">
                    <GoogleLogin
                      clientId={googleClient}
                      className="social-button class-ggl mb-2"
                      buttonText="Login with Google"
                      onSuccess={this.googleLogin}
                    />
                    <FacebookLogin
                      appId={fbId}
                      cssClass="social-button class-fb"
                      icon="fa-facebook"
                      fields="name,email"
                      callback={this.fbLogin}
                    />
                    <div className="break">
                      <span className="or">
                        OR
                      </span>
                    </div>
                  </div>
                  {login_error}
                  <FormGroup>
                    <Input className="form-bg" type="email" name="email" onChange={this.handleChange} placeholder="Email" required minLength="6" value={this.state.email}/>
                  </FormGroup>
                  <FormGroup>
                    <Input className="form-bg" type="password" name="password" onChange={this.handleChange} placeholder="Password" required minLength="8" value={this.state.password}/>
                  </FormGroup>
                  <button className="btn-primary btn-lg btn-block" type="submit">Login</button>
                  <div className="text-center small mt-2"><Link style={{color:'#8da2b5'}}to='/reset'>Forgot your password?</Link></div>
                  <hr/>
                  <div className="text-center">Dont have an account? <a href="/signup" onClick={this.openRegister}>Sign Up</a></div>
                </div>
              </Form>
              <Form id="signup-form" onSubmit={this.signupSubmit}>
                  <img className="login-logo" src="/logo.svg" alt="logo"/>
                <div className="px-5 pb-5 pt-4">
                  <div className="text-center">
                    <h4 className="mb-4">Sign Up</h4>
                  </div>
                  {auth_error}
                  <div className="social-login">
                    <GoogleLogin
                      clientId={googleClient}
                      className="social-button class-ggl mb-2"
                      buttonText="Sign up with Google"
                      onSuccess={this.googleLogin}
                      onFailure={this.googleLoginError}
                    />
                    <FacebookLogin
                      appId={fbId}
                      cssClass="social-button class-fb"
                      icon="fa-facebook"
                      textButton="Sign up with Facebook"
                      fields="name,email"
                      callback={this.fbLogin}
                    />
                    <div className="break">
                      <span className="or">
                        OR
                      </span>
                    </div>
                  </div>
                  {signup_error}
                  <FormGroup>
                    <Input className="form-bg" type="text" name="r_name" onChange={this.handleChange} placeholder="Full Name" required minLength="3" value={this.state.r_name}/>
                  </FormGroup>
                  <FormGroup>
                    <Input className="form-bg" type="email" name="r_email" onChange={this.handleChange} placeholder="Email" required minLength="6" value={this.state.r_email}/>
                  </FormGroup>
                  <FormGroup>
                    <Input className="form-bg" type="password" name="r_password" onChange={this.handleChange} placeholder="Password" required minLength="8" value={this.state.r_password}/>
                  </FormGroup>
                  <button className="btn-primary btn-lg btn-block" type="submit">Create Account</button>
                  <hr/>
                  <div className="text-center">Already have an account? <a href="/login" onClick={this.openLogin}>Login</a></div>
                </div>
              </Form>
            </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    login: (user) => dispatch(login(user)),
    signup: (user) => dispatch(signup(user)),
    fbLogin: (user) => dispatch(fbLogin(user)),
    googleLogin: (user) => dispatch(googleLogin(user))
  }
}
export default connect(null, mapDispatchToProps)(Account);
