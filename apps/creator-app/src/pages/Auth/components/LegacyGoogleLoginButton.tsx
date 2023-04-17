import { Utils } from '@voiceflow/common';
import React from 'react';
import GoogleLogin, { GoogleLoginProps, GoogleLoginResponse } from 'react-google-login';

import { GOOGLE_CLIENT_ID, IS_TEST } from '@/config';

import GoogleSocialButton from './GoogleSocialButton';

export interface LegacyGoogleLoginButtonProps {
  light?: boolean;
  disabled?: boolean;
  onLogin: (userProfile: GoogleLoginResponse) => Promise<void>;
}

// vitest uses ES imports only, so the cjs modules with default named export not converted to default ES export
const GglLogin: typeof GoogleLogin = IS_TEST ? (GoogleLogin as any).default || GoogleLogin : GoogleLogin;

const LegacyGoogleLoginButton: React.FC<LegacyGoogleLoginButtonProps> = ({ light, disabled, onLogin }) => (
  <GglLogin
    clientId={GOOGLE_CLIENT_ID}
    render={(renderProps) => <GoogleSocialButton onClick={renderProps?.onClick} light={light} disabled={disabled} />}
    onSuccess={onLogin as GoogleLoginProps['onSuccess']}
    onFailure={Utils.functional.noop}
  />
);

export default LegacyGoogleLoginButton;
