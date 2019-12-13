import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import GoogleLogin from 'react-google-login';
import { connect } from 'react-redux';

import { FACEBOOK_APP_ID, GOOGLE_CLIENT_ID } from '@/config';
import { facebookLogin, googleLogin } from '@/ducks/session';

import { SocialLoginContainer } from './AuthBoxes';

const SocialLogin = ({ entryText, light, coupon, disabled, googleLogin, facebookLogin }) => {
  const [authError, setAuthError] = useState(null);
  let timeout;

  const triggerGoogleLogin = (userProfile) => {
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

  const triggerFbLogin = (fbUser) => {
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
              !disabled && renderProps.onClick();
            }}
            className={cn('social-button', { 'social-button-light': light })}
          >
            <img src="/google.svg" alt="" />
            Google
          </div>
        )}
        onSuccess={triggerGoogleLogin}
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
  facebookLogin,
  googleLogin,
};

export default connect(
  null,
  mapDispatchToProps
)(SocialLogin);
