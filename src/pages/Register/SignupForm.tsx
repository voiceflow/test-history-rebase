import './Account.css';

import axios from 'axios';
import throttle from 'lodash/throttle';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Form, FormGroup, Input } from 'reactstrap';

import { ControlledInput } from '@/components/Input';
import Button from '@/components/LegacyButton';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';
import * as Query from '@/utils/query';

import { AuthBox } from './AuthBoxes';
import AuthenticationContainer from './AuthenticationWrapper';
import SocialLogin from './SocialLogin';
import { replaceSpaceWithPlus } from './utils';

export type SignupFormProps = RouteComponentProps & {
  promo?: boolean;
};

export const SignupForm: React.FC<SignupFormProps & ConnectedSignupFormProps> = ({ signup, history, promo, location }) => {
  const query = Query.parse(location.search);
  const [signupError, setSignupError] = React.useState<string | boolean | null>(null);
  const [email, setEmail] = React.useState(query.email ? replaceSpaceWithPlus(query.email) : '');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState(query.name ? query.name : '');

  const [coupon, setCoupon] = React.useState('');
  const [couponValid, setCouponValid] = React.useState(false);
  let timeout: number | undefined;

  const openLogin = (event: React.MouseEvent) => {
    event.preventDefault();
    history.push(`/login${location.search}`);
    return false;
  };

  const signupSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    signup({
      name,
      email,
      password,
      coupon: coupon.toLowerCase(),
    }).catch((err) => {
      setSignupError(err.body.data);
    });
    return false;
  };

  React.useEffect(() => {
    timeout = setTimeout(() => {
      setSignupError(false);
    }, 5000);

    return () => clearTimeout(timeout);
  });

  const verifyCoupon = React.useCallback(
    throttle<(input?: string) => Promise<void>>(async (input) => {
      setCouponValid(false);

      if (!input) return;

      const { data } = await axios.get(`/workspaces/coupon/${input}`);

      if (data) {
        setCouponValid(true);
      }
    }, 1000),
    []
  );

  const onCouponChange = React.useCallback(
    async (value) => {
      setCoupon(value.toUpperCase());
      verifyCoupon(value.toLowerCase());
    },
    [verifyCoupon]
  );

  const isSignupDisabled = !!coupon && !couponValid;

  React.useEffect(() => {
    if (promo && query.coupon) {
      onCouponChange(query.coupon);
    }
  }, [promo, query.coupon]);

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
                minLength={3}
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
                minLength={6}
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
                minLength={8}
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
                  error={isSignupDisabled}
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
                  {query.invite ? 'Join Team' : 'Create Account'}
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
  signup: Session.signup,
};

type ConnectedSignupFormProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(SignupForm) as React.FC<SignupFormProps>;
