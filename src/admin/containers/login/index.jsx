import * as _ from 'lodash';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Input } from 'reactstrap';

import { login } from '@/admin/store/ducks/account';
import Button from '@/components/Button';

import { AuthBox } from './AuthBoxes';
import AuthenticationContainer from './AuthenticationWrapper';
import SocialLogin from './SocialLogin';

const LoginForm = ({ login, location }) => {
  const query = queryString.parse(location.search);
  const [loginError, setLoginError] = useState(null);
  const [email, setEmail] = useState(query.email ? query.email : '');
  const [password, setPassword] = useState('');
  let timeout;

  const loginSubmit = (e) => {
    e.preventDefault();
    login({
      email,
      password,
    }).catch((err) => {
      const errText = _.get(err, ['response', 'data', 'data']) || err;

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
          <div className="logo">
            <img className="auth-logo" src="/logo.png" alt="logo" />
            <div className="admin-icon">Internal</div>
          </div>
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
              <Input
                className="form-bg"
                type="password"
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
                <a href="https://creator.voiceflow.com">Back to voiceflow</a>
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

export default connect(
  null,
  { login }
)(LoginForm);
