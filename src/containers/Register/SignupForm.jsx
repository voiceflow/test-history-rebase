import './Account.css';

import Button from 'components/Button';
import { signup } from 'ducks/account';
import queryString from 'query-string/index';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Input } from 'reactstrap';

import AuthenticationContainer from './AuthenticationWrapper';
import ErrorWidget from './ErrorWidget';
import { SignupContainer } from './SignupContainer';
import SocialLogin from './SocialLogin';

export const SignupForm = ({ signup, history }) => {
  const query = queryString.parse(location.search);
  const [signupError, setSignupError] = useState(null);
  const [email, setEmail] = useState(query.email ? query.email : '');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  let timeout;

  const openLogin = (e) => {
    e.preventDefault();
    history.push('/login');
    return false;
  };

  const signupSubmit = (e) => {
    e.preventDefault();
    signup({
      name,
      email,
      password,
    }).catch((err) => {
      setSignupError(err.response.data.data);
    });
    return false;
  };

  useEffect(() => {
    timeout = setTimeout(() => {
      setSignupError(false);
    }, 5000);

    return () => clearTimeout(timeout);
  });

  return (
    <AuthenticationContainer dark>
      <SignupContainer>
        <Form onSubmit={signupSubmit} className="signup-form auth-form">
          <img className="login-logo" src="/logo-white.svg" alt="logo" />
          <div className="signup-form-wrapper">
            <FormGroup>
              <Input
                className="form-bg"
                type="text"
                name="name"
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                required
                minLength="3"
                value={name}
              />
            </FormGroup>
            <FormGroup>
              <Input
                className="form-bg"
                type="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                minLength="6"
                value={email}
              />
            </FormGroup>
            <FormGroup>
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
              <div className="col-6 auth__link">
                <a onClick={openLogin}>Have an account?</a>
              </div>
              <div className="col-6">
                <Button isPrimary isLarge isBlock type="submit">
                  Create Account
                </Button>
              </div>
            </div>
          </div>
        </Form>

        <SocialLogin entryText="Or sign up with" />

        {signupError && (
          <div className="errorContainer row">
            <div className="col-1">
              <img src="/error.svg" alt="" />
            </div>
            <div className="col-11">{signupError}</div>
          </div>
        )}
      </SignupContainer>
    </AuthenticationContainer>
  );
};

const mapDispatchToProps = (dispatch) => ({
  signup: (user) => dispatch(signup(user)),
});

export default connect(
  null,
  mapDispatchToProps
)(SignupForm);
