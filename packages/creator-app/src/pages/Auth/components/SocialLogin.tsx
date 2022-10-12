import { Box, Flex, toast } from '@voiceflow/ui';
import React from 'react';
import { ReactFacebookLoginInfo } from 'react-facebook-login';
import { GoogleLoginResponse } from 'react-google-login';

import { IS_PRIVATE_CLOUD } from '@/config';
import * as AccountDuck from '@/ducks/account';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { Account } from '@/models';
import THEME from '@/styles/theme';
import { ConnectedProps } from '@/types';
import * as Sentry from '@/vendors/sentry';

import { SocialLoginContainer } from './AuthBoxes';
import FacebookLoginButton from './FacebookLoginButton';
import GoogleLoginButton from './GoogleLoginButton';

export interface SocialLoginProps {
  light?: boolean;
  coupon?: string;
  disabled?: boolean;
  loginMode?: boolean;
}

const SocialLogin: React.FC<SocialLoginProps & ConnectedSocialLoginProps> = ({
  light,
  coupon,
  disabled,
  loginMode,
  googleLogin,
  facebookLogin,
  saveSocialProfilePicture,
}) => {
  const onGoogleLogin = async (userProfile: GoogleLoginResponse) => {
    let user: Account | undefined;

    try {
      user = await googleLogin({
        name: userProfile.profileObj.name,
        email: userProfile.profileObj.email,
        googleId: userProfile.profileObj.googleId,
        token: userProfile.tokenId,
        coupon,
      });
    } catch (error) {
      Sentry.error(error);
      toast.error('An unexpected error occurred. Please try again or use a different sign up method.');
    }

    if (user?.first_login && userProfile.profileObj.imageUrl) {
      await saveSocialProfilePicture(userProfile.profileObj.imageUrl);
    }
  };

  const onFacebookLogin = async (fbUser: ReactFacebookLoginInfo) => {
    let user: Account | undefined;

    try {
      user = await facebookLogin({
        name: fbUser.name,
        email: fbUser.email,
        fbId: fbUser.id,
        code: fbUser.accessToken,
        uri: window.location.href,
        coupon,
      });
    } catch (error) {
      Sentry.error(error);
      toast.error('An unexpected error occurred. Please try again or use a different sign up method.');
    }

    if (user?.first_login && fbUser.picture?.data.url) {
      await saveSocialProfilePicture(fbUser.picture.data.url);
    }
  };

  if (IS_PRIVATE_CLOUD) {
    return null;
  }

  return (
    <SocialLoginContainer>
      <Flex>
        <Box color={loginMode ? THEME.colors.secondary : THEME.colors.tertiary} mr={16}>
          {loginMode ? 'Or log in with' : 'Or sign up with'}
        </Box>
        <GoogleLoginButton disabled={disabled} light={light} onLogin={onGoogleLogin} />
        <FacebookLoginButton disabled={disabled} light={light} onLogin={onFacebookLogin} />
      </Flex>
    </SocialLoginContainer>
  );
};

const mapDispatchToProps = {
  googleLogin: Session.googleLogin,
  facebookLogin: Session.facebookLogin,
  saveSocialProfilePicture: AccountDuck.saveSocialProfilePicture,
};

type ConnectedSocialLoginProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(SocialLogin) as React.FC<SocialLoginProps>;
