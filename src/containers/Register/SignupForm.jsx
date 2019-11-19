import './Account.css';

import axios from 'axios';
import throttle from 'lodash/throttle';
import moment from 'moment';
import queryString from 'query-string/index';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import { Form, FormGroup, Input } from 'reactstrap';

import Button from '@/components/Button';
import Icon from '@/components/SvgIcon';
import { PLAN_NAME } from '@/containers/Dashboard/PLANS';
import { signup } from '@/ducks/session';

import { AuthBox, Check, MsgBox } from './AuthBoxes';
import AuthenticationContainer from './AuthenticationWrapper';
import SocialLogin from './SocialLogin';

export const SignupForm = ({ signup, history, promo }) => {
  // eslint-disable-next-line no-restricted-globals
  const query = queryString.parse(location.search);
  const [signupError, setSignupError] = useState(null);
  const [email, setEmail] = useState(query.email ? query.email : '');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(query.name ? query.name : '');
  const [coupon, setCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState({ err: false, msg: null });
  const [couponValid, setCouponValid] = useState(false);
  const [couponError, setCouponError] = useState(false);
  let timeout;

  const openLogin = (e) => {
    e.preventDefault();
    history.push('/login');
    return false;
  };

  const checkCoupon = () => {
    if (coupon && !couponValid) {
      setCouponError(true);
      return false;
    }

    return true;
  };

  const signupSubmit = (e) => {
    e.preventDefault();

    if (!checkCoupon()) return;

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

      if (!input) return setCouponMsg({ err: false, msg: null });
      const { data } = await axios.get(`/team/coupons/${input}`);
      if (!data.valid) {
        setCouponMsg({ err: true, msg: 'Promo code does not exist, please try again' });
      } else if (data.stripeCoupon) {
        setCouponMsg({ err: true, msg: 'Please apply this promo code after signing up' });
      } else {
        setCouponMsg({
          err: false,
          msg: `Voiceflow ${PLAN_NAME[data.plan]} for ${moment.duration(data.duration, 'days').humanize()}`,
        });
        setCouponValid(true);
      }
    }, 1000),
    []
  );

  const onCouponChange = async (value) => {
    setCouponError(false);
    setCoupon(value);

    verifyCoupon(value);
  };

  useEffect(() => {
    if (promo && query.coupon) onCouponChange(query.coupon);
  }, []);

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
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
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
                <Input
                  className="form-bg"
                  type="text"
                  name="coupon"
                  onChange={(e) => onCouponChange(e.target.value)}
                  style={{
                    paddingRight: couponValid ? 40 : undefined,
                  }}
                  placeholder="Promo code"
                  minLength="3"
                  value={coupon}
                />
                {couponValid && (
                  <Check>
                    <Tooltip title={couponMsg.msg} position="top">
                      <Icon icon="check2" color="green" size={20} />
                    </Tooltip>
                  </Check>
                )}
                {couponError && (
                  <div className="row mt-0">
                    <MsgBox error={couponMsg.err}>{couponMsg.msg}</MsgBox>
                  </div>
                )}
              </FormGroup>
            )}
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

        <SocialLogin entryText="Or sign up with" coupon={coupon} checkCoupon={checkCoupon} />

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
