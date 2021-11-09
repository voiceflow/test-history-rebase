import { Utils } from '@voiceflow/common';
import { ButtonVariant } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';
import GoogleLogin, { GoogleLoginProps, GoogleLoginResponse } from 'react-google-login';

import { googleLogo } from '@/assets';
import { GOOGLE_CLIENT_ID } from '@/config';

import SocialButton from './SocialButton';

export interface GoogleLoginButtonProps {
  light?: boolean;
  disabled?: boolean;
  onLogin: (userProfile: GoogleLoginResponse) => Promise<void>;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ light, disabled, onLogin }) => (
  <GoogleLogin
    clientId={GOOGLE_CLIENT_ID}
    render={(renderProps) => (
      <SocialButton
        variant={ButtonVariant.SECONDARY}
        onClick={() => !disabled && renderProps!.onClick()}
        className={cn('social-button', { 'social-button-light': light })}
      >
        <img src={googleLogo} alt="Google Login" />
        Google
      </SocialButton>
    )}
    onSuccess={onLogin as GoogleLoginProps['onSuccess']}
    onFailure={Utils.functional.noop}
  />
);

export default GoogleLoginButton;
