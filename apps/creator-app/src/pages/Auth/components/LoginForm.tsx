import { Box, Button, ClickableText, preventDefault, SvgIcon, ThemeColor, toast, useDebouncedCallback, useSetup, useToggle } from '@voiceflow/ui';
import { AxiosError } from 'axios';
import _get from 'lodash/get';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { wordmark } from '@/assets';
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

export const LoginForm: React.FC<LoginFormProps> = ({ query, children }) => {
  const location = useLocation<{ redirectTo?: string } | null>();

  const [email, setEmail] = React.useState(query.email ? replaceSpaceWithPlus(query.email)! : '');
  const [isSaml, setIsSaml] = React.useState<boolean>(false);
  const [password, setPassword] = React.useState('');
  const [showPassword, toggleShowPassword] = useToggle();

  const signin = useDispatch(Session.signin);
  const goToSignup = useDispatch(Router.goToSignup, location.search);
  const getSamlLoginURL = useDispatch(Session.getSamlLoginURL);

  const debouncedCheckSSO = useDebouncedCallback(
    100,
    async (email: string) => {
      const url = await getSamlLoginURL(email);

      setIsSaml(!!url);
    },
    [getSamlLoginURL]
  );

  const onChangeEmail = (email: string) => {
    debouncedCheckSSO(email);
    setEmail(email);
  };

  const onSubmit = async () => {
    debouncedCheckSSO.cancel();

    const samlLoginURL = await getSamlLoginURL(email);

    if (samlLoginURL) {
      setIsSaml(!!isSaml);

      window.location.assign(samlLoginURL);
      return;
    }

    try {
      await signin({ email, password }, { redirectTo: location.state?.redirectTo });
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
        <form onSubmit={preventDefault(onSubmit)}>
          <img className="auth-logo" src={wordmark} alt="logo" />

          <div className="auth-form-wrapper">
            <HeaderBox>
              <h1>Log In to your account</h1>
            </HeaderBox>

            <InputContainer>
              <EmailInput value={email} onChange={onChangeEmail} />
            </InputContainer>

            {!isSaml && (
              <InputContainer className="passwordInput">
                <PasswordInput value={password} onChange={setPassword} showPassword={showPassword} />

                {password.length !== 0 && <ShowPasswordIcon showPassword={showPassword} onClick={() => toggleShowPassword()} />}

                <Link className="forgotLink" to="/reset">
                  Forgot password?
                </Link>
              </InputContainer>
            )}

            <Box.FlexApart pt={8}>
              {isSaml ? (
                <Box.FlexCenter color={ThemeColor.SECONDARY}>
                  <SvgIcon icon="lockLocked" inline mr={14} />
                  SAML SSO enabled
                </Box.FlexCenter>
              ) : (
                <div className="auth__link">
                  {IS_PRIVATE_CLOUD ? <span /> : <ClickableText onClick={() => goToSignup()}>Don't have an account?</ClickableText>}
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
