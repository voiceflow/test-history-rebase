import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import GoogleLogin from 'react-google-login';
import { connect } from 'react-redux';

import { fbLogin, googleLogin } from '@/admin/store/ducks/account';
import { GOOGLE_CLIENT_ID } from '@/config';

import { SocialLoginContainer } from './AuthBoxes';

const SocialLogin = ({ entryText, light, googleLogin }) => {
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
          <div onClick={renderProps.onClick} className={cn('social-button', { 'social-button-light': light })}>
            <img src="/google.svg" alt="" />
            Google
          </div>
        )}
        onSuccess={triggerGoogleLogin}
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

const mapDispatchToProps = (dispatch) => ({
  fbLogin: (user) => dispatch(fbLogin(user)),
  googleLogin: (user) => dispatch(googleLogin(user)),
});

export default connect(
  null,
  mapDispatchToProps
)(SocialLogin);
