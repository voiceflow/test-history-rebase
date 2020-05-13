import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import { ReactFacebookLoginInfo } from 'react-facebook-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import GoogleLogin, { GoogleLoginProps, GoogleLoginResponse } from 'react-google-login';

import { FACEBOOK_APP_ID, GOOGLE_CLIENT_ID } from '@/config';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';
import { noop } from '@/utils/functional';

import { SocialLoginContainer } from './AuthBoxes';

export type SocialLoginProps = {
  entryText: string;
  light?: boolean;
  coupon?: string;
  disabled?: boolean;
};

const SocialLogin: React.FC<SocialLoginProps & ConnectedSocialLoginProps> = ({ entryText, light, coupon, disabled, googleLogin, facebookLogin }) => {
  const [authError, setAuthError] = useState<null | boolean>(null);
  let timeout: number | undefined;

  const triggerGoogleLogin = (userProfile: GoogleLoginResponse) => {
    googleLogin({
      name: userProfile.profileObj.name,
      email: userProfile.profileObj.email,
      googleId: userProfile.profileObj.googleId,
      token: userProfile.tokenId,
      coupon,
    }).catch((err) => {
      setAuthError(err.body.data);
    });
    return false;
  };

  const triggerFbLogin = (fbUser: ReactFacebookLoginInfo) => {
    facebookLogin({
      name: fbUser.name,
      email: fbUser.email,
      fbId: fbUser.id,
      code: fbUser.accessToken,
      uri: window.location.href,
      coupon,
    }).catch((err) => {
      setAuthError(err.body.data);
    });
    return false;
  };

  useEffect(() => {
    timeout = setTimeout(() => {
      setAuthError(false);
    }, 5000);

    return () => clearTimeout(timeout);
  });

  return (
    <SocialLoginContainer>
      <div className="helperText">{entryText}</div>
      <GoogleLogin
        clientId={GOOGLE_CLIENT_ID}
        render={(renderProps) => (
          <div
            onClick={() => {
              !disabled && renderProps!.onClick();
            }}
            className={cn('social-button', { 'social-button-light': light })}
          >
            <img src="/google.svg" alt="" />
            Google
          </div>
        )}
        onSuccess={triggerGoogleLogin as GoogleLoginProps['onSuccess']}
        onFailure={noop}
      />
      <FacebookLogin
        appId={FACEBOOK_APP_ID}
        fields="name,email"
        render={(renderProps) => (
          <div
            onClick={() => {
              !disabled && renderProps.onClick();
            }}
            className={cn('social-button', { 'social-button-light': light })}
          >
            <img src="/facebook.svg" alt="" />
            Facebook
          </div>
        )}
        callback={triggerFbLogin}
      />
      {authError && (
        <div className="errorContainer row">
          <div className="col-1">
            <img src="/error.svg" alt="" />
          </div>
          <div className="col-11">An unexpected error occurred. Please try again or use a different sign up method.</div>
        </div>
      )}
    </SocialLoginContainer>
  );
};

const mapDispatchToProps = {
  facebookLogin: Session.facebookLogin,
  googleLogin: Session.googleLogin,
};

type ConnectedSocialLoginProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(SocialLogin) as React.FC<SocialLoginProps>;
