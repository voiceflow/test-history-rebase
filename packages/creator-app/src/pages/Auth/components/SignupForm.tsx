import {
  Box,
  Button,
  ClickableText,
  ControlledInput,
  Input,
  Link,
  preventDefault,
  ThemeColor,
  toast,
  useDebouncedCallback,
  useThrottledCallback,
} from '@voiceflow/ui';
import React from 'react';

import { wordmarkLight } from '@/assets';
import client from '@/client';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useDispatch } from '@/hooks';
import { Query } from '@/models';
import * as QueryUtil from '@/utils/query';
import * as GoogleAnalytics from '@/vendors/googleAnalytics';

import { MIN_PASSWORD_LENGTH, SSO_REQUIRED } from '../constants';
import { getDomainSAML } from '../hooks';
import { replaceSpaceWithPlus } from '../utils';
import { AuthBox } from './AuthBoxes';
import AuthenticationContainer from './AuthenticationContainer';
import EmailInput from './EmailInput';
import HeaderBox from './HeaderBox';
import InputContainer from './InputContainer';
import PasswordInput from './PasswordInput';
import SocialLogin from './SocialLogin';
import TermsAndConditionsContainer from './TermsAndConditionsContainer';

export interface SignupFormProps {
  query: Query.Auth;
  promo?: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({ promo, query }) => {
  const signup = useDispatch(Session.signup);
  const goToLogin = useDispatch(Router.goToLogin);

  const [email, setEmail] = React.useState(query.email ? replaceSpaceWithPlus(query.email)! : '');
  const [coupon, setCoupon] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [firstName, setFirstName] = React.useState(query.name ? query.name : '');
  const [submitting, setSubmitting] = React.useState(false);
  const [ssoRequired, setSsoRequired] = React.useState(false);
  const [couponValid, setCouponValid] = React.useState(false);

  const onCheckSSO = useDebouncedCallback(100, async (email: string) => {
    const samlDOmain = await getDomainSAML(email);

    setSsoRequired(!!samlDOmain);
  });

  const onVerifyCoupon = useThrottledCallback(1000, async (input: string) => {
    setCouponValid(false);

    if (!input) return;

    const isValid = await client.workspace.validateCoupon(input);

    if (isValid) {
      setCouponValid(true);
    }
  });

  const onGoToLogin = () => {
    goToLogin(QueryUtil.stringify(query));
  };

  const onChangeEmail = (email: string) => {
    setEmail(email);
    onCheckSSO(email);
  };

  const onCouponChange = (value: string) => {
    setCoupon(value.toUpperCase());
    onVerifyCoupon(value.toLowerCase());
  };

  const onSubmit = async () => {
    if (submitting || ssoRequired) return;

    try {
      setSubmitting(true);

      GoogleAnalytics.sendEvent(GoogleAnalytics.Category.AUTH_SIGNUP_PAGE, GoogleAnalytics.Action.CLICK, GoogleAnalytics.Label.SIGN_UP_BUTTON);

      const samlDomain = await getDomainSAML(email);

      if (samlDomain) {
        setSsoRequired(true);
      } else {
        await signup({ email, query, coupon, password, lastName, firstName });
      }
    } catch (error) {
      const message = error?.message;

      toast.error(message ? `Unable to signup: ${message}` : 'Unable to signup, try again later');
    } finally {
      setSubmitting(false);
    }
  };

  React.useEffect(() => {
    if (promo && query.coupon) {
      onCouponChange(query.coupon);
    }
  }, [promo, query.coupon]);

  const isSignupDisabled = !!coupon && !couponValid;

  return (
    <AuthenticationContainer dark>
      <AuthBox>
        <form onSubmit={preventDefault(onSubmit)}>
          <img className="auth-logo" src={wordmarkLight} alt="logo" />

          <div className="auth-form-wrapper">
            <HeaderBox>
              <h1>Create your account</h1>
            </HeaderBox>

            <InputContainer>
              <Input type="text" value={firstName} required autoFocus minLength={1} placeholder="First name" onChangeText={setFirstName} />
            </InputContainer>

            <InputContainer>
              <Input type="text" value={lastName} required minLength={1} placeholder="Last name" onChangeText={setLastName} />
            </InputContainer>

            <InputContainer>
              <EmailInput value={email} onChange={onChangeEmail} placeholder="Email address" error={ssoRequired} />

              {ssoRequired && (
                <Box mt={8} fontSize={13} color={ThemeColor.RED}>
                  {SSO_REQUIRED}
                </Box>
              )}
            </InputContainer>

            <Box mb={22}>
              <PasswordInput minLength={MIN_PASSWORD_LENGTH} value={password} onChange={setPassword} />
            </Box>

            {promo && (
              <InputContainer>
                <ControlledInput
                  type="text"
                  name="promo"
                  value={coupon}
                  error={isSignupDisabled}
                  complete={couponValid}
                  placeholder="Promo Code"
                  onChangeText={onCouponChange}
                />
              </InputContainer>
            )}

            <Box.FlexApart pt={8}>
              <div className="auth__link">
                <ClickableText onClick={onGoToLogin}>Have an account?</ClickableText>
              </div>

              <div>
                <Button type="submit" variant={Button.Variant.PRIMARY} disabled={submitting || isSignupDisabled}>
                  {query.invite ? 'Join Team' : 'Create Account'}
                </Button>
              </div>
            </Box.FlexApart>

            <TermsAndConditionsContainer>
              By clicking "Create account", I agree to Voiceflow's{' '}
              <Link color="#3d82e2" href="https://www.voiceflow.com/terms">
                TOS
              </Link>{' '}
              and{' '}
              <Link color="#3d82e2" href="https://www.voiceflow.com/privacy">
                Privacy Policy
              </Link>
              .
            </TermsAndConditionsContainer>
          </div>
        </form>

        <SocialLogin coupon={coupon} disabled={isSignupDisabled} />
      </AuthBox>
    </AuthenticationContainer>
  );
};

export default SignupForm;
