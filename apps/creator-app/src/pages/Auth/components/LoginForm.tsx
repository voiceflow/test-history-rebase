import { Utils } from '@voiceflow/common';
import { Box, Button, preventDefault, System, TippyTooltip, toast, useSmartReducerV2 } from '@voiceflow/ui';
import { AxiosError } from 'axios';
import _get from 'lodash/get';
import React from 'react';
import { useLocation } from 'react-router-dom';

import { voiceflowWordmarkDark } from '@/assets';
import client from '@/client';
import { IS_PRIVATE_CLOUD } from '@/config';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useDispatch } from '@/hooks';
import { Query } from '@/models';
import HeaderBox from '@/pages/Auth/components/HeaderBox';

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
    password: '',
    isPassword: false,
    submitting: false,
    showPassword: false,
    emailFocused: false,
    showEmailError: false,
    passwordFocused: false,
    showPasswordError: false,
  });

  const verifyForm = () => {
    if (!verifyEmail(state.email)) {
      emailRef.current?.focus();

      return false;
    }

    if (state.isPassword && !verifyPassword(state.password)) {
      passwordRef.current?.focus();

      return false;
    }

    return true;
  };

  const onSubmit = async () => {
    stateAPI.update({
      showEmailError: !verifyEmail(state.email),
      showPasswordError: state.isPassword ? !verifyPassword(state.password) : false,
    });

    if (!verifyForm()) return;

    if (query.invite) {
      const inviteTokenValid = await client.identity.workspaceInvitation.checkInvite(query.invite).catch(() => false);

      if (!inviteTokenValid) {
        toast.error('Invite link is expired or broken, please contact your workspace admin.');

        return;
      }
    }

    const samlLoginURL = await getSamlLoginURL(state.email);

    if (samlLoginURL) {
      window.location.assign(samlLoginURL);
      return;
    }

    if (state.isPassword && state.password) {
      try {
        await signin({ email: state.email, password: state.password }, { redirectTo: location.state?.redirectTo });
      } catch (error) {
        let errText = _get(error, ['body', 'data']) || 'Unable to login, try again later';

        if (error instanceof AxiosError && error.response?.status === 401) {
          errText = 'Username or Password Incorrect';
        }

        toast.error(errText);
      }
      return;
    }

    stateAPI.isPassword.set(true);
    passwordRef.current?.focus();
  };

  return (
    <AuthenticationContainer>
      <AuthBox>
        <form onSubmit={preventDefault(onSubmit)} noValidate>
          <img className="auth-logo" src={voiceflowWordmarkDark} alt="logo" />

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
                  onChange={(email) => stateAPI.update({ email, showEmailError: false })}
                  required={false}
                  minLength={0}
                  placeholder="Email address"
                />
              </TippyTooltip>
            </InputContainer>

            {state.isPassword && (
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
              <div className="auth__link">
                {IS_PRIVATE_CLOUD ? (
                  <span />
                ) : (
                  <System.Link.Button type="button" onClick={() => goToSignup()}>
                    Don't have an account?
                  </System.Link.Button>
                )}
              </div>

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
