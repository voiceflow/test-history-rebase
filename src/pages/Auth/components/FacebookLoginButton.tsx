import cn from 'classnames';
import React from 'react';
import { ReactFacebookLoginInfo } from 'react-facebook-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

import Button, { ButtonVariant } from '@/components/Button';
import { FACEBOOK_APP_ID } from '@/config';

export type FacebookLoginButtonProps = {
  light?: boolean;
  disabled?: boolean;
  onLogin: (fbUser: ReactFacebookLoginInfo) => Promise<void>;
};

const FacebookLoginButton: React.FC<FacebookLoginButtonProps> = ({ light, disabled, onLogin }) => (
  <FacebookLogin
    appId={FACEBOOK_APP_ID}
    fields="name,email,picture"
    render={(renderProps) => (
      <Button
        variant={ButtonVariant.SECONDARY}
        onClick={() => !disabled && renderProps!.onClick()}
        className={cn('social-button', { 'social-button-light': light })}
      >
        <img src="/facebook.svg" alt="Facebook Login" />
        Facebook
      </Button>
    )}
    callback={onLogin}
  />
);

export default FacebookLoginButton;
