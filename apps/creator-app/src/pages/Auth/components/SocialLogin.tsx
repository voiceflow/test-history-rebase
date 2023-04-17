import { datadogRum } from '@datadog/browser-rum';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, toast } from '@voiceflow/ui';
import React from 'react';
import { ReactFacebookLoginInfo } from 'react-facebook-login';
import { GoogleLoginResponse } from 'react-google-login';

import { IS_PRIVATE_CLOUD } from '@/config';
import * as AccountDuck from '@/ducks/account';
import * as Session from '@/ducks/session';
import { useDispatch, useFeature } from '@/hooks';
import { Account } from '@/models';
import THEME from '@/styles/theme';

import { SocialLoginContainer } from './AuthBoxes';
import FacebookSocialButton from './FacebookSocialButton';
import GoogleSocialButton from './GoogleSocialButton';
import LegacyFacebookLoginButton from './LegacyFacebookLoginButton';
import LegacyGoogleLoginButton from './LegacyGoogleLoginButton';

export interface SocialLoginProps {
  light?: boolean;
  coupon?: string;
  disabled?: boolean;
  loginMode?: boolean;
}

const SocialLogin: React.FC<SocialLoginProps> = ({ light, coupon, disabled, loginMode }) => {
  const identityUser = useFeature(Realtime.FeatureFlag.IDENTITY_USER);

  const googleLogin = useDispatch(Session.googleLogin);
  const facebookLogin = useDispatch(Session.facebookLogin);
  const legacyGoogleLogin = useDispatch(Session.legacyGoogleLogin);
  const legacyFacebookLogin = useDispatch(Session.legacyFacebookLogin);
  const saveSocialProfilePicture = useDispatch(AccountDuck.saveSocialProfilePicture);

  const onLegacyGoogleLogin = async (userProfile: GoogleLoginResponse) => {
    let user: Account | undefined;

    try {
      user = await legacyGoogleLogin({
        name: userProfile.profileObj.name,
        email: userProfile.profileObj.email,
        googleId: userProfile.profileObj.googleId,
        token: userProfile.tokenId,
        coupon,
      });
    } catch (error) {
      datadogRum.addError(error);
      toast.error('An unexpected error occurred. Please try again or use a different sign up method.');
    }

    if (user?.first_login && userProfile.profileObj.imageUrl) {
      await saveSocialProfilePicture(userProfile.profileObj.imageUrl);
    }
  };

  const onLegacyFacebookLogin = async (fbUser: ReactFacebookLoginInfo) => {
    let user: Account | undefined;

    try {
      user = await legacyFacebookLogin({
        name: fbUser.name,
        email: fbUser.email,
        fbId: fbUser.id,
        code: fbUser.accessToken,
        uri: window.location.href,
        coupon,
      });
    } catch (error) {
      datadogRum.addError(error);
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
      <Box.Flex>
        <Box color={loginMode ? THEME.colors.secondary : THEME.colors.tertiary} mr={16}>
          {loginMode ? 'Or log in with' : 'Or sign up with'}
        </Box>

        {identityUser.isEnabled ? (
          <>
            <GoogleSocialButton light={light} onClick={googleLogin} disabled={disabled} />
            <FacebookSocialButton light={light} onClick={facebookLogin} disabled={disabled} />
          </>
        ) : (
          <>
            <LegacyGoogleLoginButton light={light} onLogin={onLegacyGoogleLogin} disabled={disabled} />
            <LegacyFacebookLoginButton light={light} onLogin={onLegacyFacebookLogin} disabled={disabled} />
          </>
        )}
      </Box.Flex>
    </SocialLoginContainer>
  );
};

export default SocialLogin;
