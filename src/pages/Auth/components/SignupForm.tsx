import { getSearch } from 'connected-react-router';
import _throttle from 'lodash/throttle';
import React from 'react';
import { Form, FormGroup, Input } from 'reactstrap';

import { wordmarkLight } from '@/assets';
import client from '@/client';
import { ControlledInput } from '@/components/Input';
import Button from '@/components/LegacyButton';
import { toast } from '@/components/Toast';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { useEnableDisable } from '@/hooks';
import { Query } from '@/models';
import { ConnectedProps, MergeArguments } from '@/types';
import { preventDefault } from '@/utils/dom';

import { replaceSpaceWithPlus } from '../utils';
import { AuthBox } from './AuthBoxes';
import AuthenticationContainer from './AuthenticationContainer';
import EmailInput from './EmailInput';
import HeaderBox from './HeaderBox';
import InputContainer from './InputContainer';
import PasswordInput from './PasswordInput';
import SocialLogin from './SocialLogin';

export type SignupFormProps = {
  query: Query.Auth;
  promo?: boolean;
};

export const SignupForm: React.FC<SignupFormProps & ConnectedPublicSignupFormProps> = ({ signup, promo, query, goToLogin }) => {
  const [email, setEmail] = React.useState(query.email ? replaceSpaceWithPlus(query.email)! : '');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState(query.name ? query.name : '');

  const [isDisabled, onDisable, onEnable] = useEnableDisable(false);

  const [coupon, setCoupon] = React.useState('');
  const [couponValid, setCouponValid] = React.useState(false);

  const isSignupDisabled = !!coupon && !couponValid;

  const signupSubmit = async () => {
    onDisable();

    if (!isDisabled) {
      try {
        await signup({
          name,
          email,
          password,
          coupon: coupon.toLowerCase(),
          referralCode: query.referral,
        });
      } catch (err) {
        toast.error(err.body.data);
      }

      onEnable();
    }
  };

  const verifyCoupon = React.useCallback(
    _throttle<(input?: string) => Promise<void>>(async (input) => {
      setCouponValid(false);

      if (!input) return;

      const isValid = await client.workspace.validateCoupon(input);

      if (isValid) {
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

  React.useEffect(() => {
    if (promo && query.coupon) {
      onCouponChange(query.coupon);
    }
  }, [promo, query.coupon]);

  return (
    <AuthenticationContainer dark>
      <AuthBox>
        <Form onSubmit={preventDefault(signupSubmit)}>
          <img className="auth-logo" src={wordmarkLight} alt="logo" />
          <div className="auth-form-wrapper">
            <HeaderBox>
              <h1>Create your account</h1>
            </HeaderBox>
            <InputContainer>
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
            </InputContainer>
            <InputContainer>
              <EmailInput value={email} onChange={setEmail} placeholder="Email address" />
            </InputContainer>
            <FormGroup>
              <PasswordInput value={password} onChange={setPassword} />
            </FormGroup>
            {promo && (
              <InputContainer>
                <ControlledInput
                  type="text"
                  name="promo"
                  onChange={(e) => onCouponChange(e.target.value)}
                  placeholder="Promo Code"
                  value={coupon}
                  complete={couponValid}
                  error={isSignupDisabled}
                />
              </InputContainer>
            )}
            <div className="row">
              <div className="col-6 auth__link">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a onClick={goToLogin}>Have an account?</a>
              </div>
              <div className="col-6">
                <Button isPrimary isLarge isBlock type="submit" disabled={isSignupDisabled}>
                  {query.invite ? 'Join Team' : 'Create Account'}
                </Button>
              </div>
            </div>
          </div>
        </Form>

        <SocialLogin coupon={coupon} disabled={isSignupDisabled} />
      </AuthBox>
    </AuthenticationContainer>
  );
};

const mapStateToProps = {
  search: getSearch,
};

const mapDispatchToProps = {
  signup: Session.signup,
  goToLogin: Router.goToLogin,
};

const mergeProps = (...[{ search }, { goToLogin }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchToProps>) => ({
  goToLogin: () => goToLogin(search),
});

type ConnectedPublicSignupFormProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SignupForm) as React.FC<SignupFormProps>;
