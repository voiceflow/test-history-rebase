import './Account.css';

import axios from 'axios';
import queryString from 'query-string/index';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Input } from 'reactstrap';

import Button from '@/components/Button';
import { signup } from '@/ducks/account';

import { AuthBox, MsgBox } from './AuthBoxes';
import AuthenticationContainer from './AuthenticationWrapper';
import SocialLogin from './SocialLogin';

export const SignupForm = ({ signup, history }) => {
  // eslint-disable-next-line no-restricted-globals
  const query = queryString.parse(location.search);
  const [signupError, setSignupError] = useState(null);
  const [email, setEmail] = useState(query.email ? query.email : '');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [coupon, setCoupon] = useState('');
  const [couponErr, setCouponErr] = useState(0);
  let timeout;
  let couponTimeout;

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
      coupon,
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

  useEffect(() => {
    clearTimeout(couponTimeout);
    couponTimeout = setTimeout(async () => {
      if (!coupon) setCouponErr(0);
      const { data } = await axios.get(`/team/coupons/${coupon}`);
      if (!data.valid) {
        setCouponErr(2);
      } else if (data.stripeCoupon) {
        setCouponErr(3);
      } else {
        setCouponErr(1);
      }
    }, 150);
    return () => clearTimeout(couponTimeout);
  }, [coupon]);

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
            <FormGroup>
              <Input
                className="form-bg"
                type="text"
                name="coupon"
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Promo code"
                minLength="3"
                value={coupon}
              />
              {couponErr === 3 && (
                <div className="row mt-0">
                  <MsgBox error>Please use this promo code after signup.</MsgBox>
                </div>
              )}
              {couponErr === 2 && (
                <div className="row mt-0">
                  <MsgBox error>Promo code does not exist, please try again.</MsgBox>
                </div>
              )}
              {couponErr === 1 && (
                <div className="row mt-0">
                  <MsgBox>Success! You've been upgraded to Voiceflow PRO for a year.</MsgBox>
                </div>
              )}
            </FormGroup>
            <div className="row">
              <div className="col-6 auth__link">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
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

        <SocialLogin entryText="Or sign up with" coupon={coupon} />

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

const mapDispatchToProps = (dispatch) => ({
  signup: (user) => dispatch(signup(user)),
});

export default connect(
  null,
  mapDispatchToProps
)(SignupForm);
