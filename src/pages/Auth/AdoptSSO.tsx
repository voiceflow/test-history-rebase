import React from 'react';
import { ReactFacebookLoginInfo } from 'react-facebook-login';
import { GoogleLoginResponse } from 'react-google-login';
import { Form, FormGroup } from 'reactstrap';

import Flex from '@/components/Flex';
import Button from '@/components/LegacyButton';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { useToggle } from '@/hooks';
import { ConnectedProps, MergeArguments } from '@/types';
import { preventDefault } from '@/utils/dom';

import {
  AuthBox,
  AuthenticationContainer,
  ErrorMessage,
  FacebookLoginButton,
  GoogleLoginButton,
  PasswordInput,
  ShowPasswordIcon,
  SocialLoginContainer,
} from './components';
import { useOktaLogin } from './hooks';

const AdoptSSO: React.FC<ConnectedAdoptSSOProps> = ({ basicAuthAdoptSSO, googleAdoptSSO, facebookAdoptSSO, goToSignup, email }) => {
  const [password, setPassword] = React.useState('');
  const [authError, setAuthError] = React.useState(false);
  const [showPassword, toggleShowPassword] = useToggle();
  const oktaLogin = useOktaLogin();

  const onLogin = async () => {
    const oktaCode = await oktaLogin();

    await basicAuthAdoptSSO(oktaCode, password);
  };

  const onGoogleLogin = async (userProfile: GoogleLoginResponse) => {
    const oktaCode = await oktaLogin();

    await googleAdoptSSO(oktaCode, userProfile.tokenId).catch(() => {
      setAuthError(true);
      return undefined;
    });
  };

  const onFacebookLogin = async (fbUser: ReactFacebookLoginInfo) => {
    const oktaCode = await oktaLogin();

    await facebookAdoptSSO(oktaCode, fbUser.accessToken).catch(() => {
      setAuthError(true);
      return undefined;
    });
  };

  React.useEffect(() => {
    if (email) return;

    goToSignup();
  }, []);

  if (!email) return null;

  return (
    <AuthenticationContainer>
      <AuthBox>
        <Form onSubmit={preventDefault(onLogin)}>
          <div className="auth-form-wrapper">
            <div className="confirm-helper">
              The email address <strong>{email}</strong> is already used by a Voiceflow account. Login below to switch to using Okta for
              authentication.
            </div>
            <FormGroup className="passwordInput">
              <PasswordInput value={password} onChange={setPassword} showPassword={showPassword} />
              {password.length !== 0 && <ShowPasswordIcon showPassword={showPassword} onClick={() => toggleShowPassword()} />}
            </FormGroup>
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
        </Form>

        <SocialLoginContainer>
          <Flex>
            <GoogleLoginButton light onLogin={onGoogleLogin} />
            <FacebookLoginButton light onLogin={onFacebookLogin} />
          </Flex>

          {authError && <ErrorMessage>An unexpected error occurred. Please try again or use a different sign up method.</ErrorMessage>}
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
  goToSignup: Router.goToSignup,
};

const mergeProps = (...[{ routerState }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchToProps>) => ({
  email: (routerState.email as string) || null,
});

type ConnectedAdoptSSOProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(AdoptSSO) as React.FC;
