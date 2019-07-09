import cn from 'classnames';
import { fbLogin, googleLogin } from 'ducks/account';
import React, { Fragment, useEffect, useState } from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import GoogleLogin from 'react-google-login';
import { connect } from 'react-redux';

import { SocialLoginContainer } from './AuthBoxes';
import { devGoogleClient, fbId, googleClient } from './social-id';

const SocialLogin = ({ entryText, light, googleLogin, fbLogin }) => {
  const [authError, setAuthError] = useState(null);
  let timeout;

  const triggerGoogleLogin = (userProfile) => {
    googleLogin({
      name: userProfile.profileObj.name,
      email: userProfile.profileObj.email,
      googleId: userProfile.profileObj.googleId,
      token: userProfile.tokenId,
    }).catch((err) => {
      setAuthError(err.response.data);
    });
    return false;
  };

  const triggerFbLogin = (fbUser) => {
    fbLogin({
      name: fbUser.name,
      email: fbUser.email,
      fbId: fbUser.id,
      code: fbUser.accessToken,
      uri: window.location.href,
    }).catch((err) => {
      setAuthError(err.response.data);
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
    <Fragment>
      <SocialLoginContainer>
        <div className="helperText">{entryText}</div>
        <GoogleLogin
          clientId={process.env.REACT_APP_BUILD_ENV === 'production' ? googleClient : devGoogleClient}
          render={(renderProps) => (
            <div onClick={renderProps.onClick} className={cn('social-button', { 'social-button-light': light })}>
              <img src="/google.svg" alt="" />
              Google
            </div>
          )}
          onSuccess={triggerGoogleLogin}
        />
        <FacebookLogin
          appId={fbId}
          fields="name,email"
          render={(renderProps) => (
            <div onClick={renderProps.onClick} className={cn('social-button', { 'social-button-light': light })}>
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
    </Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  fbLogin: (user) => dispatch(fbLogin(user)),
  googleLogin: (user) => dispatch(googleLogin(user)),
});

export default connect(
  null,
  mapDispatchToProps
)(SocialLogin);
