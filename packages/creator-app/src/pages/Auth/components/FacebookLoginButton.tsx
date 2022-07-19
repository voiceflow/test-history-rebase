import { ButtonVariant } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';
import { ReactFacebookLoginInfo } from 'react-facebook-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

import { facebookLogo } from '@/assets';
import { FACEBOOK_APP_ID, IS_TEST } from '@/config';

import SocialButton from './SocialButton';

export interface FacebookLoginButtonProps {
  light?: boolean;
  disabled?: boolean;
  onLogin: (fbUser: ReactFacebookLoginInfo) => Promise<void>;
}

// vitest uses ES imports only, so the cjs modules with default named export not converted to default ES export
const FBLogin: typeof FacebookLogin = IS_TEST ? (FacebookLogin as any).default || FacebookLogin : FacebookLogin;

const FacebookLoginButton: React.FC<FacebookLoginButtonProps> = ({ light, disabled, onLogin }) => (
  <FBLogin
    appId={FACEBOOK_APP_ID}
    fields="name,email,picture"
    render={(renderProps) => (
      <SocialButton
        variant={ButtonVariant.SECONDARY}
        onClick={() => !disabled && renderProps!.onClick()}
        className={cn('social-button', { 'social-button-light': light })}
      >
        <img src={facebookLogo} alt="Facebook Login" />
        Facebook
      </SocialButton>
    )}
    callback={onLogin}
  />
);

export default FacebookLoginButton;
