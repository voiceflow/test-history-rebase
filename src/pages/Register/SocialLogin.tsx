import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import { ReactFacebookLoginInfo } from 'react-facebook-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import GoogleLogin, { GoogleLoginProps, GoogleLoginResponse } from 'react-google-login';

import Button, { ButtonVariant } from '@/components/Button';
import { FlexApart } from '@/components/Flex';
import { FACEBOOK_APP_ID, GOOGLE_CLIENT_ID, OKTA_CLIENT_ID, OKTA_DOMAIN, OKTA_SCOPES } from '@/config';
import { FeatureFlag } from '@/config/features';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { useFeature, useTeardown } from '@/hooks';
import { ConnectedProps } from '@/types';
import { noop } from '@/utils/functional';
import OKTA from '@/utils/okta';

import { SocialLoginContainer } from './AuthBoxes';

export type SocialLoginProps = {
  light?: boolean;
  coupon?: string;
  disabled?: boolean;
  entryText: string;
};

const SocialLogin: React.FC<SocialLoginProps & ConnectedSocialLoginProps> = ({
  light,
  coupon,
  disabled,
  ssoLogin,
  entryText,
  googleLogin,
  facebookLogin,
}) => {
  const sso = useFeature(FeatureFlag.SSO);

  const [authError, setAuthError] = useState<null | boolean>(null);
  const okta = React.useMemo(
    () =>
      new OKTA({
        domain: OKTA_DOMAIN,
        scopes: OKTA_SCOPES,
        clientID: OKTA_CLIENT_ID,
      }),
    []
  );

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

  const onSSOLogin = async () => {
    try {
      const { code } = await okta.login(`${window.location.origin}/login/sso/callback`);

      await ssoLogin({ code, coupon: coupon || undefined });
    } catch (err) {
      setAuthError(err);
    }
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

  useTeardown(() => {
    okta.closeChannel();
  });

  return (
    <SocialLoginContainer>
      <FlexApart>
        {!sso.isEnabled && <div className="helperText">{entryText}</div>}

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
          fields="name,email"
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

        {sso.isEnabled && (
          <Button
            icon="lock"
            variant={ButtonVariant.SECONDARY}
            onClick={onSSOLogin}
            className={cn('social-button', { 'social-button-light': light })}
          >
            SSO
          </Button>
        )}
      </FlexApart>

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
  ssoLogin: Session.ssoLogin,
  googleLogin: Session.googleLogin,
  facebookLogin: Session.facebookLogin,
};

type ConnectedSocialLoginProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(SocialLogin) as React.FC<SocialLoginProps>;
