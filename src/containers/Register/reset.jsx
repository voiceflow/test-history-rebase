import axios from 'axios';
import React, { Component } from 'react';
import { FormGroup, Input } from 'reactstrap';

import Button from '@/components/Button';
import { Spinner } from '@/components/Spinner';

import { AuthBox } from './AuthBoxes';
import AuthenticationContainer from './AuthenticationWrapper';

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
              <Input className="form-bg" type="email" name="email" onChange={this.handleChange} placeholder="Email address" required minLength="6" />
            </FormGroup>
            <div style={{ height: '45px', marginTop: '32px' }}>
              <div className="float-left auth__link">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a onClick={() => this.props.history.push('/login')}>Back to Signing in</a>
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
        return <Spinner message="Sending Email" />;
      case 2:
        return (
          <>
            <div className="confirm-helper">
              The confirmation link has been sent to {this.state.email}. If it doesn't appear within a few minutes, check your spam folder.
            </div>
            <div className="auth__link">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a onClick={() => this.props.history.push('/login')}>Back to Signing in</a>
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
        <AuthBox>
          <div className="auth-form-wrapper">{this.renderStage()}</div>
          {this.state.error && (
            <div className="errorContainer row">
              <div className="col-1">
                <img src="/error.svg" alt="" />
              </div>
              <div className="col-11">{this.state.error}</div>
            </div>
          )}
        </AuthBox>
      </AuthenticationContainer>
    );
  }
}

export default Reset;
