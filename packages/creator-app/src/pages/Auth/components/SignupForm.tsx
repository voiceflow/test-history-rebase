import {
  Box,
  BoxFlexApart,
  Button,
  ButtonVariant,
  ClickableText,
  ControlledInput,
  Input,
  Link,
  preventDefault,
  ThemeColor,
  toast,
} from '@voiceflow/ui';
import { getSearch } from 'connected-react-router';
import _throttle from 'lodash/throttle';
import React from 'react';

import { wordmarkLight } from '@/assets';
import client from '@/client';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { useDebouncedCallback, useEnableDisable } from '@/hooks';
import { Query } from '@/models';
import { ConnectedProps, MergeArguments } from '@/types';
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

export const SignupForm: React.FC<SignupFormProps & ConnectedPublicSignupFormProps> = ({ search, signup, promo, query, goToLogin }) => {
  const [email, setEmail] = React.useState(query.email ? replaceSpaceWithPlus(query.email)! : '');
  const [password, setPassword] = React.useState('');
  const [firstName, setFirstName] = React.useState(query.name ? query.name : '');
  const [lastName, setLastName] = React.useState('');
  const [ssoRequired, setSsoRequired] = React.useState(false);
  const debouncedCheckSSO = useDebouncedCallback(100, async (email: string) => setSsoRequired(!!(await getDomainSAML(email))), []);

  const updateEmail = (email: string) => {
    debouncedCheckSSO(email);
    setEmail(email);
  };

  const [isDisabled, onDisable, onEnable] = useEnableDisable(false);

  const [coupon, setCoupon] = React.useState('');
  const [couponValid, setCouponValid] = React.useState(false);

  const isSignupDisabled = !!coupon && !couponValid;

  const signupSubmit = async () => {
    if (isDisabled || ssoRequired) return;

    onDisable();

    try {
      if (await getDomainSAML(email)) {
        setSsoRequired(true);
      } else {
        const name = `${firstName} ${lastName}`.trim();
        await signup(
          {
            name,
            email,
            password,
            coupon: coupon.toLowerCase(),
            referralCode: query.referral,
            referralRockCode: query.ref_code,
            urlSearch: search,
          },
          { utm_first_name: firstName, utm_last_name: lastName }
        );
      }
    } catch (err) {
      toast.error(err.body.data);
    }
    onEnable();
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
        <form onSubmit={preventDefault(signupSubmit)}>
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
              <EmailInput value={email} onChange={updateEmail} placeholder="Email address" error={ssoRequired} />

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
                  onChange={(e) => onCouponChange(e.target.value)}
                  placeholder="Promo Code"
                  value={coupon}
                  complete={couponValid}
                  error={isSignupDisabled}
                />
              </InputContainer>
            )}

            <BoxFlexApart pt={8}>
              <div className="auth__link">
                <ClickableText onClick={goToLogin}>Have an account?</ClickableText>
              </div>

              <div>
                <Button
                  variant={ButtonVariant.PRIMARY}
                  type="submit"
                  disabled={isDisabled || isSignupDisabled}
                  onClick={() =>
                    GoogleAnalytics.sendEvent(
                      GoogleAnalytics.Category.AUTH_SIGNUP_PAGE,
                      GoogleAnalytics.Action.CLICK,
                      GoogleAnalytics.Label.SIGN_UP_BUTTON
                    )
                  }
                >
                  {query.invite ? 'Join Team' : 'Create Account'}
                </Button>
              </div>
            </BoxFlexApart>

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
