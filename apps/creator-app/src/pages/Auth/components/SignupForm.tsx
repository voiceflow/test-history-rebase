import {
  Box,
  Button,
  ClickableText,
  ControlledInput,
  Input,
  Link,
  preventDefault,
  ThemeColor,
  TippyTooltip,
  toast,
  useDebouncedCallback,
  useThrottledCallback,
} from '@voiceflow/ui';
import React from 'react';

import { wordmarkLight } from '@/assets';
import client from '@/client';
import { ELEVEN_CHAR_REGEX, LOWERCASE_CHAR_REGEX, NUMBER_REGEX, SPECIAL_CHAR_REGEX, UPPERCASE_CHAR_REGEX } from '@/constants';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useDispatch, useTrackingEvents } from '@/hooks';
import { Query } from '@/models';
import { getErrorMessage } from '@/utils/error';
import * as QueryUtil from '@/utils/query';
import * as GoogleAnalytics from '@/vendors/googleAnalytics';

import { replaceSpaceWithPlus } from '../utils';
import { AuthBox } from './AuthBoxes';
import AuthenticationContainer from './AuthenticationContainer';
import EmailInput from './EmailInput';
import HeaderBox from './HeaderBox';
import InputContainer from './InputContainer';
import PasswordInput from './PasswordInput';
import PasswordVerification from './PasswordVerification';
import SocialLogin from './SocialLogin';
import TermsAndConditionsContainer from './TermsAndConditionsContainer';

export interface SignupFormProps {
  query: Query.Auth;
  promo?: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({ promo, query }) => {
  const [trackingEvents] = useTrackingEvents();

  const signup = useDispatch(Session.signup);
  const goToLogin = useDispatch(Router.goToLogin);
  const getSamlLoginURL = useDispatch(Session.getSamlLoginURL);

  const [email, setEmail] = React.useState(query.email ? replaceSpaceWithPlus(query.email)! : '');
  const [coupon, setCoupon] = React.useState('');
  const [isSaml, setIsSaml] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [firstName, setFirstName] = React.useState(query.name ? query.name : '');
  const [submitting, setSubmitting] = React.useState(false);
  const [couponValid, setCouponValid] = React.useState(false);
  const [passwordValid, setPasswordValid] = React.useState(true);

  const verifyPassword = (password = '') => {
    const requiredRegexes = [ELEVEN_CHAR_REGEX, LOWERCASE_CHAR_REGEX, NUMBER_REGEX, SPECIAL_CHAR_REGEX, UPPERCASE_CHAR_REGEX];

    return requiredRegexes.every((regex) => regex.test(password));
  };

  const onCheckSSO = useDebouncedCallback(250, async (email: string) => {
    const samlLoginURL = await getSamlLoginURL(email);

    setIsSaml(!!samlLoginURL);
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
    if (submitting || isSaml) return;

    if (!verifyPassword(password)) {
      setPasswordValid(false);

      return;
    }

    try {
      setSubmitting(true);
      setPasswordValid(true);

      GoogleAnalytics.sendEvent(GoogleAnalytics.Category.AUTH_SIGNUP_PAGE, GoogleAnalytics.Action.CLICK, GoogleAnalytics.Label.SIGN_UP_BUTTON);

      const samlLoginURL = await getSamlLoginURL(email);

      if (samlLoginURL) {
        setIsSaml(true);
      } else {
        const user = await signup({ email, query, coupon, password, lastName, firstName });

        trackingEvents.identifySignup({ email: user.email, lastName, firstName, creatorID: user.creatorID });
      }
    } catch (error) {
      const message = getErrorMessage(error);

      toast.error(`Unable to signup: ${message}`);
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
              <EmailInput value={email} onChange={onChangeEmail} placeholder="Email address" error={isSaml} />

              {isSaml && (
                <Box mt={8} fontSize={13} color={ThemeColor.RED}>
                  Your email domain is part of an enterprise SSO identity provider. Enter your email on the{' '}
                  <ClickableText onClick={onGoToLogin}>log in page</ClickableText> to continue.
                </Box>
              )}
            </InputContainer>

            <Box mb={22}>
              <TippyTooltip visible={!passwordValid && !verifyPassword(password)} content={<PasswordVerification password={password} />}>
                <PasswordInput required={false} value={password} onChange={setPassword} />
              </TippyTooltip>
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
