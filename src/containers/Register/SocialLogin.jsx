import { fbLogin, googleLogin } from 'ducks/account';
import React, { Fragment, useEffect, useState } from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import GoogleLogin from 'react-google-login';
import { connect } from 'react-redux';

import ErrorWidget from './ErrorWidget';
import { devGoogleClient, fbId, googleClient } from './social-id';
import { SocialLoginContainer } from './SignupContainer';

const SocialLogin = ({ entryText, googleLogin, fbLogin }) => {
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

  console.log('auth error: ', authError);

  return (
    <Fragment>
      {/*<ErrorWidget error={authError} color="danger" />*/}
      <div>error</div>
      <SocialLoginContainer>
        <div className="helperText">Or sign up with</div>
        <GoogleLogin
          clientId={process.env.REACT_APP_BUILD_ENV === 'production' ? googleClient : devGoogleClient}
          render={(renderProps) => (
            <div onClick={renderProps.onClick} className="social-button">
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
            <div onClick={renderProps.onClick} className="social-button">
              <img src="/facebook.svg" alt="" />
              Facebook
            </div>
          )}
          callback={triggerFbLogin}
        />
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
