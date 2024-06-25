import { Utils } from '@voiceflow/common';
import {
  Box,
  Button,
  Input,
  preventDefault,
  System,
  ThemeColor,
  TippyTooltip,
  toast,
  useDebouncedCallback,
  useSmartReducerV2,
} from '@voiceflow/ui';
import React from 'react';

import { voiceflowWordmark } from '@/assets';
import client from '@/client';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useDispatch, usePartnerStack, useTrackingEvents } from '@/hooks';
import type { Query } from '@/models';
import { useHubspotInject } from '@/pages/Auth/components/useHubspotInject';
import { getErrorMessage } from '@/utils/error';
import * as QueryUtil from '@/utils/query';
import * as GoogleAnalytics from '@/vendors/googleAnalytics';

import { replaceSpaceWithPlus } from '../utils';
import { AuthBox } from './AuthBoxes';
import AuthenticationContainer from './AuthenticationContainer';
import { PASSWORD_REGEXES } from './constants';
import EmailInput from './EmailInput';
import HeaderBox from './HeaderBox';
import InputContainer from './InputContainer';
import PasswordInput from './PasswordInput';
import PasswordVerification from './PasswordVerification';
import SocialLogin from './SocialLogin';
import TermsAndConditionsContainer from './TermsAndConditionsContainer';

export interface SignupFormProps {
  query: Query.Auth;
}

const verifyEmail = (email: string) => email.length >= 6 && Utils.emails.isValidEmail(email);
const verifyPassword = (password: string) => PASSWORD_REGEXES.every((regex) => password.match(regex));
const verifyLastName = (lastName: string) => !!lastName;
const verifyFirstName = (firstName: string) => !!firstName;

export const SignupForm: React.FC<SignupFormProps> = ({ query }) => {
  const [trackingEvents] = useTrackingEvents();
  useHubspotInject();

  const signup = useDispatch(Session.signup);
  const goToLogin = useDispatch(Router.goToLogin);
  const getSamlLoginURL = useDispatch(Session.getSamlLoginURL);
  const getPartnerKey = usePartnerStack();

  const [state, stateAPI] = useSmartReducerV2({
    email: query.email ? replaceSpaceWithPlus(query.email)! : '',
    isSaml: false,
    password: '',
    lastName: '',
    firstName: query.name ? query.name : '',
    submitting: false,
    emailFocused: false,
    submittedOnce: false,
    showEmailError: false,
    lastNameFocused: false,
    passwordFocused: false,
    firstNameFocused: false,
    showLastNameError: false,
    showPasswordError: false,
    showFirstNameError: false,
  });

  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const firstNameRef = React.useRef<HTMLInputElement>(null);
  const secondNameRef = React.useRef<HTMLInputElement>(null);

  const onCheckSSO = useDebouncedCallback(250, async (email: string) => {
    const samlLoginURL = await getSamlLoginURL(email);

    stateAPI.isSaml.set(!!samlLoginURL);
  });

  const onGoToLogin = () => goToLogin(QueryUtil.stringify(query));

  const onChangeEmail = (email: string) => {
    stateAPI.update({ email, showEmailError: false });
    onCheckSSO(email);
  };

  const verifyForm = () => {
    if (!verifyFirstName(state.firstName)) {
      firstNameRef.current?.focus();

      return false;
    }

    if (!verifyLastName(state.lastName)) {
      secondNameRef.current?.focus();

      return false;
    }

    if (!verifyEmail(state.email)) {
      emailRef.current?.focus();

      return false;
    }

    if (!verifyPassword(state.password)) {
      passwordRef.current?.focus();

      return false;
    }

    return true;
  };

  const onSubmit = async () => {
    stateAPI.update({
      submittedOnce: true,
      showEmailError: !verifyEmail(state.email),
      showLastNameError: !verifyLastName(state.lastName),
      showFirstNameError: !verifyFirstName(state.firstName),
    });

    if (!verifyForm()) return;
    if (state.submitting || state.isSaml) return;

    try {
      stateAPI.submitting.set(true);

      GoogleAnalytics.sendEvent(
        GoogleAnalytics.Category.AUTH_SIGNUP_PAGE,
        GoogleAnalytics.Action.CLICK,
        GoogleAnalytics.Label.SIGN_UP_BUTTON
      );

      const samlLoginURL = await getSamlLoginURL(state.email);

      if (samlLoginURL) {
        stateAPI.isSaml.set(true);

        return;
      }

      if (query.invite) {
        const inviteTokenValid = await client.identity.workspaceInvitation.checkInvite(query.invite).catch(() => false);

        if (!inviteTokenValid) {
          toast.error('Invite link is expired or broken, please contact your workspace admin.');

          return;
        }
      }

      const user = await signup({
        email: state.email,
        query,
        password: state.password,
        lastName: state.lastName,
        firstName: state.firstName,
        partnerKey: getPartnerKey(),
      });

      trackingEvents.identifySignup({
        email: user.email,
        lastName: state.lastName,
        firstName: state.firstName,
        creatorID: user.creatorID,
      });
    } catch (error) {
      const message = getErrorMessage(error);

      toast.error(`Unable to signup: ${message}`);
    } finally {
      stateAPI.submitting.set(false);
    }
  };

  // verifying password on every change to improve UX
  const passwordValid = React.useMemo(() => verifyPassword(state.password), [state.password]);

  return (
    <AuthenticationContainer dark>
      <AuthBox>
        <form onSubmit={preventDefault(onSubmit)} noValidate>
          <img className="auth-logo" src={voiceflowWordmark} alt="logo" />

          <div className="auth-form-wrapper">
            <HeaderBox>
              <h1>Create your account</h1>
            </HeaderBox>

            <InputContainer>
              <TippyTooltip
                visible={state.showFirstNameError && state.firstNameFocused}
                offset={[0, 5]}
                content="First name is required"
                placement="bottom-start"
              >
                <Input
                  ref={firstNameRef}
                  type="text"
                  value={state.firstName}
                  onBlur={() => stateAPI.firstNameFocused.set(false)}
                  onFocus={() => stateAPI.firstNameFocused.set(true)}
                  placeholder="First name"
                  onChangeText={(firstName) => stateAPI.update({ firstName, showFirstNameError: false })}
                />
              </TippyTooltip>
            </InputContainer>

            <InputContainer>
              <TippyTooltip
                offset={[0, 5]}
                visible={state.showLastNameError && state.lastNameFocused}
                content="Last name is required"
                placement="bottom-start"
              >
                <Input
                  ref={secondNameRef}
                  type="text"
                  value={state.lastName}
                  onBlur={() => stateAPI.lastNameFocused.set(false)}
                  onFocus={() => stateAPI.lastNameFocused.set(true)}
                  placeholder="Last name"
                  onChangeText={(lastName) => stateAPI.update({ lastName, showLastNameError: false })}
                />
              </TippyTooltip>
            </InputContainer>

            <InputContainer>
              <TippyTooltip
                offset={[0, 5]}
                visible={state.showEmailError && state.emailFocused}
                content={
                  // eslint-disable-next-line no-nested-ternary
                  !state.email
                    ? 'Email is required'
                    : state.email.length >= 6
                      ? 'Email is invalid'
                      : 'Email must be at least 6 characters'
                }
                placement="bottom-start"
              >
                <EmailInput
                  ref={emailRef}
                  value={state.email}
                  error={state.isSaml}
                  onBlur={() => stateAPI.emailFocused.set(false)}
                  onFocus={() => stateAPI.emailFocused.set(true)}
                  onChange={onChangeEmail}
                  required={false}
                  minLength={0}
                  placeholder="Email address"
                />
              </TippyTooltip>

              {state.isSaml && (
                <Box mt={8} fontSize={13} color={ThemeColor.RED}>
                  Your email domain is part of an enterprise SSO identity provider. Enter your email on the{' '}
                  <System.Link.Button onClick={onGoToLogin}>log in page</System.Link.Button> to continue.
                </Box>
              )}
            </InputContainer>

            <Box mb={22}>
              <TippyTooltip
                offset={[0, 5]}
                visible={state.submittedOnce && state.passwordFocused && !passwordValid}
                content={<PasswordVerification password={state.password} />}
                placement="bottom-start"
              >
                <PasswordInput
                  ref={passwordRef}
                  value={state.password}
                  onBlur={() => stateAPI.passwordFocused.set(false)}
                  onFocus={() => stateAPI.passwordFocused.set(true)}
                  required={false}
                  onChange={stateAPI.password.set}
                />
              </TippyTooltip>
            </Box>

            <Box.FlexApart pt={8}>
              <div className="auth__link">
                <System.Link.Button type="button" onClick={onGoToLogin}>
                  Have an account?
                </System.Link.Button>
              </div>

              <div>
                <Button type="submit" variant={Button.Variant.PRIMARY} disabled={state.submitting}>
                  {query.invite ? 'Join Team' : 'Create Account'}
                </Button>
              </div>
            </Box.FlexApart>

            <TermsAndConditionsContainer>
              By clicking "Create account", I agree to Voiceflow's{' '}
              <System.Link.Anchor href="https://www.voiceflow.com/terms">TOS</System.Link.Anchor> and{' '}
              <System.Link.Anchor href="https://www.voiceflow.com/privacy">Privacy Policy</System.Link.Anchor>.
            </TermsAndConditionsContainer>
          </div>
        </form>

        <SocialLogin />
      </AuthBox>
    </AuthenticationContainer>
  );
};

export default SignupForm;
