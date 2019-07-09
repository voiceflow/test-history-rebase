import Button from 'components/Button';
import { login } from 'ducks/account';
import * as _ from 'lodash';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Input } from 'reactstrap';

import { AuthBox } from './AuthBoxes';
import AuthenticationContainer from './AuthenticationWrapper';
import SocialLogin from './SocialLogin';

export const LoginForm = ({ login, history, location }) => {
  const query = queryString.parse(location.search);
  const [loginError, setLoginError] = useState(null);
  const [email, setEmail] = useState(query.email ? query.email : '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [unverified] = useState(false);
  let timeout;

  const openRegister = (e) => {
    e.preventDefault();
    history.push(`/signup${location.search}`);
    return false;
  };

  const loginSubmit = (e) => {
    e.preventDefault();
    login({
      email,
      password,
    }).catch((err) => {
      const errText = _.get(err, ['response', 'data', 'data']) || (unverified ? 'Please verify your email to use Facebook login' : false);
      setLoginError(errText);
    });
    return false;
  };

  useEffect(() => {
    timeout = setTimeout(() => {
      setLoginError(false);
    }, 5000);

    return () => clearTimeout(timeout);
  });

  return (
    <AuthenticationContainer>
      <AuthBox>
        <Form onSubmit={loginSubmit}>
          <img className="auth-logo" src="/logo.png" alt="logo" />
          <div className="auth-form-wrapper">
            <FormGroup>
              <Input
                className="form-bg"
                type="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                minLength="6"
                value={email}
              />
            </FormGroup>
            <FormGroup className="passwordInput">
              {password.length === 0 ? (
                <Link className="forgotLink" to="/reset">
                  Forgot?
                </Link>
              ) : (
                // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                <img
                  onClick={() => setShowPassword(!showPassword)}
                  className="viewPassword"
                  src={showPassword ? '/eye-hide.svg' : '/eye.svg'}
                  alt=""
                />
              )}
              <Input
                className="form-bg"
                type={showPassword ? 'text' : 'password'}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                minLength="8"
                value={password}
              />
            </FormGroup>
            <div className="row">
              <div className="col-8 auth__link">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a onClick={openRegister}>Don't have an account?</a>
              </div>
              <div className="col-4">
                <Button isPrimary isBlock type="submit">
                  Sign in
                </Button>
              </div>
            </div>
          </div>
        </Form>
        <SocialLogin entryText="Or sign in with" light />
        {loginError && (
          <div className="errorContainer row">
            <div className="col-1">
              <img src="/error.svg" alt="" />
            </div>
            <div className="col-11">{loginError}</div>
          </div>
        )}
      </AuthBox>
    </AuthenticationContainer>
  );
};

const mapDispatchToProps = (dispatch) => ({
  login: (user) => dispatch(login(user)),
});

export default connect(
  null,
  mapDispatchToProps
)(LoginForm);
