/* eslint-disable sonarjs/no-duplicate-string */

import axios from 'axios';
import cn from 'classnames';
import React, { Component } from 'react';
import { FormGroup, Input } from 'reactstrap';

import Button from '@/components/Button';

import { AuthBox } from './AuthBoxes';
import AuthenticationContainer from './AuthenticationWrapper';

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      confirm: '',
      stage: 0,
      error: null,
      email: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.renderStage = this.renderStage.bind(this);
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillMount() {
    const { match } = this.props;
    axios
      .get(`/user/reset/${match.params.id}`)
      .then(() => {
        this.setState({
          stage: 1,
        });
      })
      .catch((err) => {
        if (err.response.status < 500) {
          this.setState({
            stage: 4,
          });
        } else {
          this.setState({
            stage: 4,
            error: 'Whoops, something went wrong with the server',
          });
        }
      });
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  resetPassword(e) {
    const { confirm, password } = this.state;
    const { match } = this.props;

    e.preventDefault();
    if (password !== confirm) {
      return this.setState({
        error: 'Passwords do not match',
      });
    }

    this.setState({ stage: 2 });
    axios
      .post(`/user/reset/${match.params.id}`, {
        password,
      })
      .then(() => {
        this.setState({
          stage: 3,
        });
      })
      .catch(() => {
        this.setState({
          stage: 4,
          error: 'Whoops, something went wrong with the server',
        });
      });
    return false;
  }

  resetEmail = (e) => {
    e.preventDefault();
    const { email } = this.state;
    axios
      .post('/user/reset', {
        email,
      })
      .then(() => {
        this.setState({ stage: 5 });
      })
      .catch((err) => {
        if (err.response && err.response.status === 409) {
          this.setState({
            error: 'Too many password reset attempts - Wait 24 hours before the next attempt',
            stage: 4,
          });
        } else {
          this.setState({
            error: 'Something went wrong, please wait and retry or contact support',
            stage: 4,
          });
        }
      });
    return false;
  };

  renderStage() {
    const { stage, confirm, password } = this.state;

    switch (stage) {
      case 0:
        return (
          <div className="super-center text-center">
            <div>
              <h5 className="pb-3">Checking Token</h5>
              <h1>
                <span className="loader" />
              </h1>
            </div>
          </div>
        );
      case 1:
        return (
          <form onSubmit={this.resetPassword} className="w-100">
            <FormGroup>
              <Input
                className="form-bg"
                type="password"
                name="password"
                onChange={this.handleChange}
                placeholder="New Password"
                required
                minLength="8"
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="password"
                name="confirm"
                onChange={this.handleChange}
                placeholder="Confirm Password"
                required
                minLength="8"
                className={cn('form-bg', {
                  invalid: password !== confirm,
                })}
              />
            </FormGroup>
            <div style={{ height: '45px', marginTop: '32px' }}>
              <div className="float-left auth__link">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a onClick={() => this.props.history.push('/login')}>Back to Signing in</a>
              </div>
              <div className="float-right">
                <Button isPrimary isBlock type="submit">
                  Update Password
                </Button>
              </div>
            </div>
          </form>
        );
      case 2:
        return (
          <div className="super-center text-center">
            <div>
              <h5 className="pb-3">Resetting Password</h5>
              <h1>
                <span className="loader" />
              </h1>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="text-center">
            <div className="confirm-helper">Your Password Has Been Reset</div>
            <div style={{ marginTop: '32px' }}>
              <div className="auth__link">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a onClick={() => this.props.history.push('/login')}>Back to Signing in</a>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <div className="confirm-helper">The password reset link has expired or is invalid. Please enter your email below to start again.</div>
            <form onSubmit={this.resetEmail} className="w-100">
              <FormGroup>
                <Input
                  className="form-bg"
                  type="email"
                  name="email"
                  onChange={this.handleChange}
                  placeholder="Email address"
                  required
                  minLength="6"
                />
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
          </div>
        );
      case 5:
        return (
          <>
            <div className="confirm-helper">
              The confirmation link has been sent to name@domain.com. If it doesn't appear within a few minutes, check your span folder.
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

export default ResetPassword;
