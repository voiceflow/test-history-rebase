import { Utils } from '@voiceflow/common';
import {
  Box,
  Button,
  preventDefault,
  SvgIcon,
  System,
  ThemeColor,
  TippyTooltip,
  useDebouncedCallback,
  useSetup,
  useSmartReducerV2,
} from '@voiceflow/ui';
import { toast } from '@voiceflow/ui-next';
import { AxiosError } from 'axios';
import _get from 'lodash/get';
import React from 'react';
import { useLocation } from 'react-router-dom';

import { wordmark } from '@/assets';
import client from '@/client';
import { IS_PRIVATE_CLOUD } from '@/config';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useDispatch } from '@/hooks';
import { Query } from '@/models';
import HeaderBox from '@/pages/Auth/components/HeaderBox';
import perf, { PerfAction } from '@/performance';

import { replaceSpaceWithPlus } from '../utils';
import { AuthBox } from './AuthBoxes';
import AuthenticationContainer from './AuthenticationContainer';
import EmailInput from './EmailInput';
import InputContainer from './InputContainer';
import PasswordInput from './PasswordInput';
import ShowPasswordIcon from './ShowPasswordIcon';

export interface LoginFormProps extends React.PropsWithChildren {
  query: Query.Auth;
}

const verifyEmail = (email: string) => Utils.emails.isValidEmail(email);
const verifyPassword = (password: string) => !!password;

export const LoginForm: React.FC<LoginFormProps> = ({ query, children }) => {
  const location = useLocation<{ redirectTo?: string } | null>();

  const signin = useDispatch(Session.signin);
  const goToSignup = useDispatch(Router.goToSignup, location.search);
  const getSamlLoginURL = useDispatch(Session.getSamlLoginURL);

  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const [state, stateAPI] = useSmartReducerV2({
    email: query.email ? replaceSpaceWithPlus(query.email)! : '',
    isSaml: false,
    password: '',
    submitting: false,
    showPassword: false,
    emailFocused: false,
    showEmailError: false,
    passwordFocused: false,
    showPasswordError: false,
  });

  const debouncedCheckSSO = useDebouncedCallback(
    100,
    async (email: string) => {
      const url = await getSamlLoginURL(email);

      stateAPI.isSaml.set(!!url);
    },
    [getSamlLoginURL]
  );

  const onChangeEmail = (email: string) => {
    stateAPI.update({ email, showEmailError: false });
    debouncedCheckSSO(email);
  };

  const verifyForm = () => {
    if (!verifyEmail(state.email)) {
      emailRef.current?.focus();

      return false;
    }

    if (!state.isSaml && !verifyPassword(state.password)) {
      passwordRef.current?.focus();

      return false;
    }

    return true;
  };

  const onSubmit = async () => {
    stateAPI.update({
      showEmailError: !verifyEmail(state.email),
      showPasswordError: !verifyPassword(state.password),
    });

    if (!verifyForm()) return;

    debouncedCheckSSO.cancel();

    if (query.invite) {
      const inviteTokenValid = await client.identity.workspaceInvitation.checkInvite(query.invite).catch(() => false);

      if (!inviteTokenValid) {
        toast.error('Invite link is expired or broken, please contact your workspace admin.');

        return;
      }
    }

    const samlLoginURL = await getSamlLoginURL(state.email);

    if (samlLoginURL) {
      stateAPI.isSaml.set(true);

      window.location.assign(samlLoginURL);
      return;
    }

    try {
      await signin({ email: state.email, password: state.password }, { redirectTo: location.state?.redirectTo });
    } catch (error) {
      let errText = _get(error, ['body', 'data']) || 'Unable to login, try again later';

      if (error instanceof AxiosError && error.response?.status === 401) {
        errText = 'Username or Password Incorrect';
      }

      toast.error(errText);
    }
  };

  useSetup(() => {
    perf.action(PerfAction.LOGIN_RENDERED);
  });

  return (
    <AuthenticationContainer>
      <AuthBox>
        <form onSubmit={preventDefault(onSubmit)} noValidate>
          <img className="auth-logo" src={wordmark} alt="logo" />

          <div className="auth-form-wrapper">
            <HeaderBox>
              <h1>Log In to your account</h1>
            </HeaderBox>

            <InputContainer>
              <TippyTooltip
                offset={[0, 5]}
                visible={state.showEmailError && state.emailFocused}
                content={!state.email ? 'Email is required' : 'Email is invalid'}
                placement="bottom-start"
              >
                <EmailInput
                  ref={emailRef}
                  value={state.email}
                  onBlur={() => stateAPI.emailFocused.set(false)}
                  onFocus={() => stateAPI.emailFocused.set(true)}
                  onChange={onChangeEmail}
                  required={false}
                  minLength={0}
                  placeholder="Email address"
                />
              </TippyTooltip>
            </InputContainer>

            {!state.isSaml && (
              <InputContainer className="passwordInput">
                <TippyTooltip
                  offset={[0, 5]}
                  visible={state.showPasswordError && state.passwordFocused}
                  content="Password is required"
                  placement="bottom-start"
                >
                  <PasswordInput
                    ref={passwordRef}
                    value={state.password}
                    onBlur={() => stateAPI.passwordFocused.set(false)}
                    onFocus={() => stateAPI.passwordFocused.set(true)}
                    required={false}
                    onChange={(password) => stateAPI.update({ password, showPasswordError: false })}
                    showPassword={state.showPassword}
                  />
                </TippyTooltip>

                {state.password.length !== 0 && <ShowPasswordIcon showPassword={state.showPassword} onClick={stateAPI.showPassword.toggle} />}

                <System.Link.Router className="forgotLink" to="/reset">
                  Forgot password?
                </System.Link.Router>
              </InputContainer>
            )}

            <Box.FlexApart pt={8}>
              {state.isSaml ? (
                <Box.FlexCenter color={ThemeColor.SECONDARY}>
                  <SvgIcon icon="lockLocked" inline mr={14} />
                  SAML SSO enabled
                </Box.FlexCenter>
              ) : (
                <div className="auth__link">
                  {IS_PRIVATE_CLOUD ? (
                    <span />
                  ) : (
                    <System.Link.Button type="button" onClick={() => goToSignup()}>
                      Don't have an account?
                    </System.Link.Button>
                  )}
                </div>
              )}

              <Button variant={Button.Variant.PRIMARY} type="submit">
                {query.invite ? 'Join Team' : 'Log In'}
              </Button>
            </Box.FlexApart>
          </div>
        </form>

        {children}
      </AuthBox>
    </AuthenticationContainer>
  );
};

export default LoginForm;
