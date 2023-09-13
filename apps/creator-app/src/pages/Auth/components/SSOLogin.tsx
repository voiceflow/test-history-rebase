import { datadogRum } from '@datadog/browser-rum';
import { Button, ButtonVariant, FlexApart, toast } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';

import * as Session from '@/ducks/session';
import { useDispatch } from '@/hooks/realtime';

import { useOktaLogin } from '../hooks';
import { SocialLoginContainer } from './AuthBoxes';

export interface SSOLoginProps {
  domain: string;
  clientID: string;
  light?: boolean;
  coupon?: string;
  disabled?: boolean;
}

const SSOLogin: React.FC<SSOLoginProps> = ({ domain, clientID, light, coupon }) => {
  const ssoLogin = useDispatch(Session.ssoLogin);
  const oktaLogin = useOktaLogin(domain, clientID);

  const onSSOLogin = async () => {
    try {
      const code = await oktaLogin();

      await ssoLogin({ domain, code, coupon: coupon || undefined });
    } catch (err) {
      datadogRum.addError(err);
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

export default SSOLogin;
