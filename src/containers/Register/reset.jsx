import axios from 'axios';
import Button from 'components/Button';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FormGroup, Input } from 'reactstrap';

import AuthenticationContainer from './AuthenticationWrapper';
import { SignupContainer } from './SignupContainer';

class Reset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      stage: 0,
      error: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.resetEmail = this.resetEmail.bind(this);
    this.renderStage = this.renderStage.bind(this);
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  resetEmail(e) {
    const { email } = this.state;
    e.preventDefault();
    this.setState({ stage: 1 });
    axios
      .post('/user/reset', {
        email,
      })
      .then(() => {
        this.setState({ stage: 2 });
      })
      .catch((err) => {
        if (err.response && err.response.status === 409) {
          this.setState({
            error: 'Too many password reset attempts - Wait 24 hours before the next attempt',
            stage: 0,
          });
        } else {
          this.setState({
            error: 'Something went wrong, please wait and retry or contact support',
            stage: 0,
          });
        }
      });
    return false;
  }

  renderStage() {
    const { stage } = this.state;
    switch (stage) {
      case 0:
        return (
          <form onSubmit={this.resetEmail} className="w-100">
            <FormGroup>
              <Input type="email" name="email" onChange={this.handleChange} placeholder="Email address" required minLength="6" />
            </FormGroup>
            <div style={{ height: '45px' }}>
              <div className="float-left auth__link">
                <Link to="/login">Back to Signing in</Link>
              </div>
              <div className="float-right">
                <Button isPrimary isBlock type="submit">
                  Reset Password
                </Button>
              </div>
            </div>
          </form>
        );
      case 1:
        return (
          <div className="super-center text-center">
            <div>
              <h5 className="pb-3">Sending Email</h5>
              <h1>
                <span className="loader" />
              </h1>
            </div>
          </div>
        );
      case 2:
        return (
          <>
            <div className="confirm-helper">
              The confirmation link has been sent to name@domain.com. If it doesn't appear within a few minutes, check your span folder.
            </div>
            <div className="auth__link">
              <Link to="/login">Back to Signing in</Link>
            </div>
          </>
        );
      default:
        return null;
    }
  }

  render() {
    return (
      <AuthenticationContainer>
        <SignupContainer>
          <div className="login-form-wrapper">{this.renderStage()}</div>
          {this.state.error && (
            <div className="errorContainer row">
              <div className="col-1">
                <img src="/error.svg" alt="" />
              </div>
              <div className="col-11">{this.state.error}</div>
            </div>
          )}
        </SignupContainer>
      </AuthenticationContainer>
    );
  }
}

export default Reset;
