import React from 'react';
import { ReactFacebookLoginInfo } from 'react-facebook-login';
import { GoogleLoginResponse } from 'react-google-login';

import Flex from '@/components/Flex';
import { IS_PRIVATE_CLOUD } from '@/config';
import * as Creator from '@/ducks/creator';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

import { useErrorTimeout } from '../hooks';
import { SocialLoginContainer } from './AuthBoxes';
import ErrorMessage from './ErrorMessage';
import FacebookLoginButton from './FacebookLoginButton';
import GoogleLoginButton from './GoogleLoginButton';

export type SocialLoginProps = {
  light?: boolean;
  coupon?: string;
  disabled?: boolean;
};

const SocialLogin: React.FC<SocialLoginProps & ConnectedSocialLoginProps> = ({
  light,
  coupon,
  disabled,
  googleLogin,
  facebookLogin,
  saveSocialProfilePicture,
}) => {
  const [authError, setAuthError] = React.useState(false);

  const onGoogleLogin = async (userProfile: GoogleLoginResponse) => {
    const user = await googleLogin({
      name: userProfile.profileObj.name,
      email: userProfile.profileObj.email,
      googleId: userProfile.profileObj.googleId,
      token: userProfile.tokenId,
      coupon,
    }).catch(() => {
      setAuthError(true);
      return undefined;
    });

    if (user?.first_login && userProfile.profileObj.imageUrl) {
      saveSocialProfilePicture(userProfile.profileObj.imageUrl);
    }
  };

  const onFacebookLogin = async (fbUser: ReactFacebookLoginInfo) => {
    const user = await facebookLogin({
      name: fbUser.name,
      email: fbUser.email,
      fbId: fbUser.id,
      code: fbUser.accessToken,
      uri: window.location.href,
      coupon,
    }).catch(() => {
      setAuthError(true);
      return undefined;
    });

    if (user?.first_login && fbUser.picture?.data.url) {
      await saveSocialProfilePicture(fbUser.picture.data.url);
    }
  };

  useErrorTimeout(!!authError, () => setAuthError(false));

  if (IS_PRIVATE_CLOUD) {
    return null;
  }

  return (
    <SocialLoginContainer>
      <Flex>
        <GoogleLoginButton disabled={disabled} light={light} onLogin={onGoogleLogin} />
        <FacebookLoginButton disabled={disabled} light={light} onLogin={onFacebookLogin} />
      </Flex>

      {authError && <ErrorMessage>An unexpected error occurred. Please try again or use a different sign up method.</ErrorMessage>}
    </SocialLoginContainer>
  );
};

const mapDispatchToProps = {
  googleLogin: Session.googleLogin,
  facebookLogin: Session.facebookLogin,
  saveSocialProfilePicture: Creator.saveSocialProfilePicture,
};

type ConnectedSocialLoginProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(SocialLogin) as React.FC<SocialLoginProps>;
