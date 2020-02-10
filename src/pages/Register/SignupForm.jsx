import './Account.css';

import axios from 'axios';
import throttle from 'lodash/throttle';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Input } from 'reactstrap';

import { ControlledInput } from '@/components/Input';
import Button from '@/components/LegacyButton';
import { signup } from '@/ducks/session';

import { AuthBox } from './AuthBoxes';
import AuthenticationContainer from './AuthenticationWrapper';
import SocialLogin from './SocialLogin';

export const SignupForm = ({ signup, history, promo, location }) => {
  const query = queryString.parse(location.search);
  const [signupError, setSignupError] = useState(null);
  const [email, setEmail] = useState(query.email ? query.email : '');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(query.name ? query.name : '');

  const [coupon, setCoupon] = useState('');
  const [couponValid, setCouponValid] = useState(false);
  let timeout;

  const openLogin = (e) => {
    e.preventDefault();
    history.push(`/login${location.search}`);
    return false;
  };

  const signupSubmit = (e) => {
    e.preventDefault();

    signup({
      name,
      email,
      password,
      coupon,
    }).catch((err) => {
      setSignupError(err.body.data);
    });
    return false;
  };

  useEffect(() => {
    timeout = setTimeout(() => {
      setSignupError(false);
    }, 5000);

    return () => clearTimeout(timeout);
  });

  const verifyCoupon = React.useCallback(
    throttle(async (input) => {
      setCouponValid(false);

      if (!input) return;

      const { data } = await axios.get(`/workspaces/coupon/${input}`);

      if (data) {
        setCouponValid(true);
      }
    }, 1000)
  );

  const onCouponChange = React.useCallback(async (value) => {
    setCoupon(value);
    verifyCoupon(value);
  });

  const isSignupDisabled = coupon && !couponValid;

  useEffect(() => {
    if (promo && query.coupon) onCouponChange(query.coupon);
  }, [onCouponChange, promo, query.coupon]);

  return (
    <AuthenticationContainer dark>
      <AuthBox>
        <Form onSubmit={signupSubmit}>
          <img className="auth-logo" src="/logo-white.svg" alt="logo" />
          <div className="auth-form-wrapper">
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
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
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
            {promo && (
              <FormGroup>
                <ControlledInput
                  type="text"
                  name="promo"
                  onChange={(e) => onCouponChange(e.target.value)}
                  placeholder="Promo Code"
                  value={coupon}
                  complete={couponValid}
                  error={coupon && !couponValid}
                />
              </FormGroup>
            )}
            <div className="row">
              <div className="col-6 auth__link">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a onClick={openLogin}>Have an account?</a>
              </div>
              <div className="col-6">
                <Button isPrimary isLarge isBlock type="submit" disabled={isSignupDisabled}>
                  Create Account
                </Button>
              </div>
            </div>
          </div>
        </Form>

        <SocialLogin entryText="Or sign up with" coupon={coupon} disabled={isSignupDisabled} />

        {signupError && (
          <div className="errorContainer row">
            <div className="col-1">
              <img src="/error.svg" alt="" />
            </div>
            <div className="col-11">{signupError}</div>
          </div>
        )}
      </AuthBox>
    </AuthenticationContainer>
  );
};

const mapDispatchToProps = {
  signup,
};

export default connect(
  null,
  mapDispatchToProps
)(SignupForm);
