import cn from 'classnames';
import React from 'react';

import { NetworkError } from '@/client/fetch';
import Button, { ButtonVariant } from '@/components/Button';
import { FlexApart } from '@/components/Flex';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

import { useErrorTimeout, useOktaLogin } from '../hooks';
import { SocialLoginContainer } from './AuthBoxes';
import ErrorMessage from './ErrorMessage';

export type SSOLoginProps = {
  domain: string;
  clientID: string;
  light?: boolean;
  coupon?: string;
  disabled?: boolean;
};

const SSOLogin: React.FC<SSOLoginProps & ConnectedSSOLoginProps> = ({ domain, clientID, light, coupon, ssoLogin, goToAdoptSSO }) => {
  const [authError, setAuthError] = React.useState(false);
  const oktaLogin = useOktaLogin(domain, clientID);

  const onSSOLogin = async () => {
    try {
      const code = await oktaLogin();

      try {
        await ssoLogin({ domain, code, coupon: coupon || undefined });
      } catch (err) {
        if (err instanceof NetworkError && err.statusCode === 409) {
          goToAdoptSSO({ domain, clientID, email: err.body.email });
        } else {
          throw err;
        }
      }
    } catch (err) {
      setAuthError(true);
    }
  };

  useErrorTimeout(!!authError, () => setAuthError(false));

  return (
    <SocialLoginContainer>
      <FlexApart fullWidth>
        <Button icon="lock" variant={ButtonVariant.SECONDARY} onClick={onSSOLogin} className={cn('social-button', { 'social-button-light': light })}>
          SSO
        </Button>
      </FlexApart>

      {authError && <ErrorMessage>An unexpected error occurred</ErrorMessage>}
    </SocialLoginContainer>
  );
};

const mapDispatchToProps = {
  ssoLogin: Session.ssoLogin,
  goToAdoptSSO: Router.goToAdoptSSO,
};

type ConnectedSSOLoginProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(SSOLogin) as React.FC<SSOLoginProps>;
