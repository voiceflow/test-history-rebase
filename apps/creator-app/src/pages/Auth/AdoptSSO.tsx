import { datadogRum } from '@datadog/browser-rum';
import { Box, Button, ButtonVariant, FlexApart, preventDefault, toast } from '@voiceflow/ui';
import React from 'react';
import { ReactFacebookLoginInfo } from 'react-facebook-login';
import { GoogleLoginResponse } from 'react-google-login';
import { Redirect } from 'react-router-dom';

import { Path } from '@/config/routes';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useDispatch, useSelector, useToggle } from '@/hooks';

import {
  AuthBox,
  AuthenticationContainer,
  LegacyFacebookLoginButton,
  LegacyGoogleLoginButton,
  PasswordInput,
  ShowPasswordIcon,
  SocialLoginContainer,
} from './components';
import { useOktaLogin } from './hooks';

const AdoptSSO: React.FC = () => {
  const routerState = useSelector(Router.stateSelector);

  const googleAdoptSSO = useDispatch(Session.googleAdoptSSO);
  const facebookAdoptSSO = useDispatch(Session.facebookAdoptSSO);
  const basicAuthAdoptSSO = useDispatch(Session.basicAuthAdoptSSO);

  const [password, setPassword] = React.useState('');
  const [showPassword, toggleShowPassword] = useToggle();

  const { email = null, domain = null, clientID = null } = routerState;

  const oktaLogin = useOktaLogin(domain || '', clientID || '');
  const hasValidState = !!email && !!domain && !!clientID;

  const onLogin = async () => {
    const oktaCode = await oktaLogin();

    await basicAuthAdoptSSO({ domain: domain!, oktaCode, authCode: password });
  };

  const onGoogleLogin = async (userProfile: GoogleLoginResponse) => {
    const oktaCode = await oktaLogin();

    try {
      await googleAdoptSSO({ domain: domain!, oktaCode, authCode: userProfile.tokenId });
    } catch (error) {
      datadogRum.addError(error);
      toast.error('An unexpected error occurred. Please try again or use a different sign up method.');
    }
  };

  const onFacebookLogin = async (fbUser: ReactFacebookLoginInfo) => {
    const oktaCode = await oktaLogin();

    try {
      await facebookAdoptSSO({ domain: domain!, oktaCode, authCode: fbUser.accessToken });
    } catch (error) {
      datadogRum.addError(error);
      toast.error('An unexpected error occurred. Please try again or use a different sign up method.');
    }
  };

  if (!hasValidState) return <Redirect to={Path.SIGNUP} />;

  return (
    <AuthenticationContainer>
      <AuthBox>
        <form onSubmit={preventDefault(onLogin)}>
          <div className="auth-form-wrapper">
            <div className="confirm-helper">
              The email address <strong>{email}</strong> is already used by a Voiceflow account. Login below to switch to using Okta for
              authentication.
            </div>
            <Box className="passwordInput" mb={22} mt={8}>
              <PasswordInput value={password} onChange={setPassword} showPassword={showPassword} />
              {password.length !== 0 && <ShowPasswordIcon showPassword={showPassword} onClick={() => toggleShowPassword()} />}
            </Box>
            <FlexApart>
              <div className="auth__link">
                <span />
              </div>

              <div>
                <Button variant={ButtonVariant.PRIMARY} type="submit">
                  Use Okta
                </Button>
              </div>
            </FlexApart>
          </div>
        </form>

        <SocialLoginContainer>
          <Box.Flex>
            {/* TODO: needs to use auth service for adopt/convert requests as well */}
            <LegacyGoogleLoginButton light onLogin={onGoogleLogin} />
            <LegacyFacebookLoginButton light onLogin={onFacebookLogin} />
          </Box.Flex>
        </SocialLoginContainer>
      </AuthBox>
    </AuthenticationContainer>
  );
};

export default AdoptSSO;
