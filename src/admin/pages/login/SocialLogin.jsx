import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import GoogleLogin from 'react-google-login';

import * as AccountV2 from '@/admin/store/ducks/accountV2';
import { errorIcon, googleLogo } from '@/assets';
import { GOOGLE_CLIENT_ID } from '@/config';
import { connect } from '@/hocs';

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
            <img src={googleLogo} alt="" />
            Google
          </div>
        )}
        onSuccess={triggerGoogleLogin}
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

const mapDispatchToProps = {
  fbLogin: AccountV2.fbLogin,
  googleLogin: AccountV2.googleLogin,
};

export default connect(null, mapDispatchToProps)(SocialLogin);
