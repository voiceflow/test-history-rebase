import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import AuthenticationService from './../../../services/Authentication';
import './Account.css';

class Account extends Component {

  constructor(props) {
    super(props);

    this.state = {
      login: (this.props.location.pathname === '/login'),
      email: "",
      password: "",
      r_name: "",
      r_email: "",
      r_password: "",
      r_code: "",
      login_error: null,
      signup_error: null,
      login_timeout: null,
      signup_timeout: null
    };

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
    AuthenticationService.signup({
      name: this.state.r_name,
      email: this.state.r_email,
      password: this.state.r_password,
      code: this.state.r_code,
    }, (error) => {
      if(error){
        this.setState({
          signup_error: error.response.data
        });
        if(this.state.signup_timeout){
          clearTimeout(this.state.signup_timeout);
        }
        this.setState({signup_timeout: setTimeout(function() {
          this.setState({signup_error: false});
        }.bind(this), 5000)})
      }else{
        this.props.history.push('/');
      }
    });
    return false;
  }

  loginSubmit(e) {
    e.preventDefault();
    AuthenticationService.login({
      email: this.state.email,
      password: this.state.password,
    }, (error) => {
      if(error){
        this.setState({
          login_error: error.response.data
        });
        if(this.state.login_timeout){
          clearTimeout(this.state.login_timeout);
        }
        this.setState({login_timeout: setTimeout(function() {
          this.setState({login_error: false});
        }.bind(this), 5000)})
      }else{
        this.props.history.push('/');
      }
    });
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
    return (
      <div className="d-flex flex-row align-items-center justify-content-center" id="main">
        <div className={"login-card " + (this.state.login ? null : "open-register")}>
            <div id="side-form">
              <Form id="login-form" onSubmit={this.loginSubmit}>
                <div className="p-4 p-md-5">
                  <h1>Login</h1>
                  <h4 className="text-muted mb-3">Use your username and password to access the Storyflow creator tool</h4>
                  {login_error}
                  <FormGroup>
                    <Label for="email">Email</Label>
                    <Input type="email" name="email" onChange={this.handleChange} placeholder="example@example.com" required minLength="6"/>
                  </FormGroup>
                  <FormGroup>
                    <Label for="password">Password</Label>
                    <Input type="password" name="password" onChange={this.handleChange} placeholder="Password" required minLength="8"/>
                  </FormGroup>
                  <Button block color="primary" type="submit">Submit</Button>
                  <hr/>
                  <p>Don't have an account? <a href="/signup" onClick={this.openRegister}>Register</a></p>
                </div>
              </Form>
              <Form id="signup-form" onSubmit={this.signupSubmit}>
                <div className="p-4 p-md-5">
                  <h1>Sign Up</h1>
                  <h4 className="text-muted  mb-3">Create your Storyflow account and get building!</h4>
                  {signup_error}
                  <FormGroup>
                    <Label for="name">Name</Label>
                    <Input type="text" name="r_name" onChange={this.handleChange} placeholder="Full Name" required minLength="3"/>
                  </FormGroup>
                  <FormGroup>
                    <Label for="email">Email</Label>
                    <Input type="email" name="r_email" onChange={this.handleChange} placeholder="example@example.com" required minLength="6"/>
                  </FormGroup>
                  <FormGroup>
                    <Label for="password">Password</Label>
                    <Input type="password" name="r_password" onChange={this.handleChange} placeholder="Password" required minLength="8"/>
                  </FormGroup>
                  {/* <FormGroup>
                    <Label for="code">Invite Code</Label>
                    <Input type="text" name="r_code" onChange={this.handleChange} placeholder="XXXXXXXXX" required minLength="6"/>
                  </FormGroup> */}
                  <Button block color="primary" type="submit">Create Account</Button>
                  <hr/>
                  <p>Already have an account? <a href="/login" onClick={this.openLogin}>Login</a></p>
                </div>
              </Form>
            </div>
            <div id="side-image">
                <div id="image1">
                  <h3><b><i>"Storyflow makes creating and sharing content for this new medium seamless"</i></b></h3>
                  <br/>
                  <h5>Chris Marley</h5>
                  <h5><b>Explorer Academy</b></h5>
                </div>
                <div id="image2">
                </div>
            </div>
        </div>
      </div>
    );
    // <p>Doesn't have an Access Code? <a href="https://getstoryflow.com">Request access</a></p>
  }
}

export default Account;
