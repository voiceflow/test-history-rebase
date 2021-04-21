import cn from 'classnames';
import React from 'react';
import GoogleLogin, { GoogleLoginProps, GoogleLoginResponse } from 'react-google-login';

import { googleLogo } from '@/assets';
import Button, { ButtonVariant } from '@/components/Button';
import { GOOGLE_CLIENT_ID } from '@/config';
import { noop } from '@/utils/functional';

export type GoogleLoginButtonProps = {
  light?: boolean;
  disabled?: boolean;
  onLogin: (userProfile: GoogleLoginResponse) => Promise<void>;
};

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ light, disabled, onLogin }) => (
  <GoogleLogin
    clientId={GOOGLE_CLIENT_ID}
    render={(renderProps) => (
      <Button
        variant={ButtonVariant.SECONDARY}
        onClick={() => !disabled && renderProps!.onClick()}
        className={cn('social-button', { 'social-button-light': light })}
      >
        <img src={googleLogo} alt="Google Login" />
        Google
      </Button>
    )}
    onSuccess={onLogin as GoogleLoginProps['onSuccess']}
    onFailure={noop}
  />
);

export default GoogleLoginButton;
