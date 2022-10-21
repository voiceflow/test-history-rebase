import React from 'react';
import { ReactFacebookLoginInfo } from 'react-facebook-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

import { FACEBOOK_APP_ID, IS_TEST } from '@/config';

import FacebookSocialButton from './FacebookSocialButton';

export interface LegacyFacebookLoginButtonProps {
  light?: boolean;
  disabled?: boolean;
  onLogin: (fbUser: ReactFacebookLoginInfo) => Promise<void>;
}

// vitest uses ES imports only, so the cjs modules with default named export not converted to default ES export
const FBLogin: typeof FacebookLogin = IS_TEST ? (FacebookLogin as any).default || FacebookLogin : FacebookLogin;

const LegacyFacebookLoginButton: React.FC<LegacyFacebookLoginButtonProps> = ({ light, disabled, onLogin }) => (
  <FBLogin
    appId={FACEBOOK_APP_ID}
    fields="name,email,picture"
    render={(renderProps) => <FacebookSocialButton light={light} disabled={disabled} onClick={renderProps.onClick} />}
    callback={onLogin}
  />
);

export default LegacyFacebookLoginButton;
