import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import { ReactFacebookLoginInfo } from 'react-facebook-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import GoogleLogin, { GoogleLoginProps, GoogleLoginResponse } from 'react-google-login';

import client from '@/client';
import Button, { ButtonVariant } from '@/components/Button';
import Flex from '@/components/Flex';
import { FACEBOOK_APP_ID, GOOGLE_CLIENT_ID, IS_PRIVATE_CLOUD } from '@/config';
import * as Creator from '@/ducks/creator';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';
import { noop } from '@/utils/functional';

import { SocialLoginContainer } from './AuthBoxes';

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
  updateProfilePicture,
}) => {
  const [authError, setAuthError] = useState<null | boolean>(null);

  const saveSocialProfilePicture = async (imageUrl: string) => {
    const blob = await fetch(imageUrl).then((r) => r.blob());
    const data = new FormData();
    data.append('image', blob);
    const s3Url = await client.file.uploadImage(null, data);
    updateProfilePicture(s3Url.data);
  };

  const triggerGoogleLogin = async (userProfile: GoogleLoginResponse) => {
    const user = await googleLogin({
      name: userProfile.profileObj.name,
      email: userProfile.profileObj.email,
      googleId: userProfile.profileObj.googleId,
      token: userProfile.tokenId,
      coupon,
    }).catch((err) => {
      setAuthError(err.body.data);
      return undefined;
    });

    if (user?.first_login && userProfile.profileObj.imageUrl) {
      saveSocialProfilePicture(userProfile.profileObj.imageUrl);
    }
    return false;
  };

  const triggerFbLogin = async (fbUser: ReactFacebookLoginInfo) => {
    const user = await facebookLogin({
      name: fbUser.name,
      email: fbUser.email,
      fbId: fbUser.id,
      code: fbUser.accessToken,
      uri: window.location.href,
      coupon,
    }).catch((err) => {
      setAuthError(err.body.data);
      return undefined;
    });

    if (user?.first_login && fbUser.picture?.data.url) {
      saveSocialProfilePicture(fbUser.picture.data.url);
    }
    return false;
  };

  useEffect(() => {
    if (authError) {
      const timeout = setTimeout(() => {
        setAuthError(false);
      }, 5000);

      return () => clearTimeout(timeout);
    }

    return undefined;
  }, [authError]);

  if (IS_PRIVATE_CLOUD) {
    return null;
  }

  return (
    <SocialLoginContainer>
      <Flex>
        <GoogleLogin
          clientId={GOOGLE_CLIENT_ID}
          render={(renderProps) => (
            <Button
              variant={ButtonVariant.SECONDARY}
              onClick={() => !disabled && renderProps!.onClick()}
              className={cn('social-button', { 'social-button-light': light })}
            >
              <img src="/google.svg" alt="Google Login" />
              Google
            </Button>
          )}
          onSuccess={triggerGoogleLogin as GoogleLoginProps['onSuccess']}
          onFailure={noop}
        />

        <FacebookLogin
          appId={FACEBOOK_APP_ID}
          fields="name,email,picture"
          render={(renderProps) => (
            <Button
              variant={ButtonVariant.SECONDARY}
              onClick={() => !disabled && renderProps!.onClick()}
              className={cn('social-button', { 'social-button-light': light })}
            >
              <img src="/facebook.svg" alt="Facebook Login" />
              Facebook
            </Button>
          )}
          callback={triggerFbLogin}
        />
      </Flex>

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
  googleLogin: Session.googleLogin,
  facebookLogin: Session.facebookLogin,
  updateProfilePicture: Creator.updateProfilePicture,
};

type ConnectedSocialLoginProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(SocialLogin) as React.FC<SocialLoginProps>;
