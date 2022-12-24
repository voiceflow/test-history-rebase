import { Button, ButtonVariant, FlexApart, isNetworkError, toast } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';

import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs/connect';
import { ConnectedProps } from '@/types';
import * as Sentry from '@/vendors/sentry';

import { useOktaLogin } from '../hooks';
import { SocialLoginContainer } from './AuthBoxes';

export interface SSOLoginProps {
  domain: string;
  clientID: string;
  light?: boolean;
  coupon?: string;
  disabled?: boolean;
}

const SSOLogin: React.FC<SSOLoginProps & ConnectedSSOLoginProps> = ({ domain, clientID, light, coupon, ssoLogin, goToAdoptSSO }) => {
  const oktaLogin = useOktaLogin(domain, clientID);

  const onSSOLogin = async () => {
    try {
      const code = await oktaLogin();

      try {
        await ssoLogin({ domain, code, coupon: coupon || undefined });
      } catch (err) {
        if (isNetworkError<{ email: string }>(err) && err.statusCode === 409) {
          goToAdoptSSO({ domain, clientID, email: err.body!.email });
        } else {
          throw err;
        }
      }
    } catch (err) {
      Sentry.error(err);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <SocialLoginContainer>
      <FlexApart fullWidth>
        <Button
          icon="lockLocked"
          variant={ButtonVariant.SECONDARY}
          onClick={onSSOLogin}
          className={cn('social-button', { 'social-button-light': light })}
        >
          SSO
        </Button>
      </FlexApart>
    </SocialLoginContainer>
  );
};

const mapDispatchToProps = {
  ssoLogin: Session.ssoLogin,
  goToAdoptSSO: Router.goToAdoptSSO,
};

type ConnectedSSOLoginProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(SSOLogin) as React.FC<SSOLoginProps>;
