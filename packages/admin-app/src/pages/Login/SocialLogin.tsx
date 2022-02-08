import cn from 'classnames';
import _get from 'lodash/get';
import React, { useEffect, useState } from 'react';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { useDispatch } from 'react-redux';

import { errorIcon, googleLogo } from '@/assets';
import { GOOGLE_CLIENT_ID } from '@/config';
import * as AccountV2 from '@/ducks/accountV2';

import { SocialLoginContainer } from './AuthBoxes';

interface SocialLoginProps {
  light?: boolean;
  entryText: string;
}

const SocialLogin: React.FC<SocialLoginProps> = ({ light, entryText }) => {
  const dispatch = useDispatch();

  const [authError, setAuthError] = useState('');

  const onGoogleLogin = async (googleResponse: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    try {
      if (!('getBasicProfile' in googleResponse)) {
        throw new Error('Google login failed');
      }

      const profile = googleResponse.getBasicProfile();

      await dispatch(
        AccountV2.googleLogin({
          name: profile.getName(),
          email: profile.getEmail(),
          googleId: googleResponse.getId(),
          token: googleResponse.getAuthResponse().id_token,
        })
      );
    } catch (error) {
      setAuthError(_get(error, ['response', 'data']));
    }
  };

  useEffect(() => {
    if (!authError) {
      return undefined;
    }

    const timeout = setTimeout(() => setAuthError(''), 5000);

    return () => clearTimeout(timeout);
  }, [authError]);

  return (
    <SocialLoginContainer>
      <div className="helperText">{entryText}</div>

      <GoogleLogin
        render={(props) => (
          <div onClick={props?.onClick} className={cn('social-button', { 'social-button-light': light })}>
            <img src={googleLogo} alt="" />
            Google
          </div>
        )}
        clientId={GOOGLE_CLIENT_ID}
        onSuccess={onGoogleLogin}
        onFailure={(err) => setAuthError(JSON.stringify(err))}
      />

      {authError && (
        <div className="errorContainer row">
          <div className="col-1">
            <img src={errorIcon} alt="" />
          </div>
          <div className="col-11">An unexpected error occurred. Please try again or use a different sign up method.</div>
        </div>
      )}
    </SocialLoginContainer>
  );
};

export default SocialLogin;
