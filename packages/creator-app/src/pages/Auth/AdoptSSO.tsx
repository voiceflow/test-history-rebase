import React from 'react';
import { ReactFacebookLoginInfo } from 'react-facebook-login';
import { GoogleLoginResponse } from 'react-google-login';
import { Redirect } from 'react-router-dom';

import Box, { Flex } from '@/components/Box';
import Button from '@/components/LegacyButton';
import { toast } from '@/components/Toast';
import { Path } from '@/config/routes';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { useToggle } from '@/hooks';
import { ConnectedProps, MergeArguments } from '@/types';
import { preventDefault } from '@/utils/dom';
import * as Sentry from '@/vendors/sentry';

import {
  AuthBox,
  AuthenticationContainer,
  FacebookLoginButton,
  GoogleLoginButton,
  PasswordInput,
  ShowPasswordIcon,
  SocialLoginContainer,
} from './components';
import { useOktaLogin } from './hooks';

const AdoptSSO: React.FC<ConnectedAdoptSSOProps> = ({ basicAuthAdoptSSO, googleAdoptSSO, facebookAdoptSSO, email, domain, clientID }) => {
  const [password, setPassword] = React.useState('');
  const [showPassword, toggleShowPassword] = useToggle();
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
      Sentry.error(error);
      toast.error('An unexpected error occurred. Please try again or use a different sign up method.');
    }
  };

  const onFacebookLogin = async (fbUser: ReactFacebookLoginInfo) => {
    const oktaCode = await oktaLogin();

    try {
      await facebookAdoptSSO({ domain: domain!, oktaCode, authCode: fbUser.accessToken });
    } catch (error) {
      Sentry.error(error);
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
            <div className="row">
              <div className="col-7 auth__link">
                <span />
              </div>
              <div className="col-5">
                <Button isPrimary isBlock type="submit">
                  Use Okta
                </Button>
              </div>
            </div>
          </div>
        </form>

        <SocialLoginContainer>
          <Flex>
            <GoogleLoginButton light onLogin={onGoogleLogin} />
            <FacebookLoginButton light onLogin={onFacebookLogin} />
          </Flex>
        </SocialLoginContainer>
      </AuthBox>
    </AuthenticationContainer>
  );
};

const mapStateToProps = {
  routerState: Router.stateSelector,
};

const mapDispatchToProps = {
  basicAuthAdoptSSO: Session.basicAuthAdoptSSO,
  googleAdoptSSO: Session.googleAdoptSSO,
  facebookAdoptSSO: Session.facebookAdoptSSO,
};

const mergeProps = (...[{ routerState }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchToProps>) => ({
  email: (routerState.email as string) || null,
  domain: (routerState.domain as string) || null,
  clientID: (routerState.clientID as string) || null,
});

type ConnectedAdoptSSOProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(AdoptSSO) as React.FC;
