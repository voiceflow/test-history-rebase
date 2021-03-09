import cn from 'classnames';
import React, { useState } from 'react';

import { NetworkError } from '@/client/fetch';
import Button, { ButtonVariant } from '@/components/Button';
import { FlexApart } from '@/components/Flex';
import { IS_PRIVATE_CLOUD } from '@/config';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

import { useErrorTimeout, useOktaLogin } from '../hooks';
import { SocialLoginContainer } from './AuthBoxes';
import ErrorMessage from './ErrorMessage';

export type SSOLoginProps = {
  light?: boolean;
  coupon?: string;
  disabled?: boolean;
};

const SSOLogin: React.FC<SSOLoginProps & ConnectedSSOLoginProps> = ({ light, coupon, ssoLogin, goToAdoptSSO }) => {
  const [authError, setAuthError] = useState<null | boolean>(null);
  const oktaLogin = useOktaLogin();

  const onSSOLogin = async () => {
    try {
      const code = await oktaLogin();

      try {
        await ssoLogin({ code, coupon: coupon || undefined });
      } catch (err) {
        if (err instanceof NetworkError && err.statusCode === 409) {
          goToAdoptSSO(err.body.email);
        } else {
          throw err;
        }
      }
    } catch (err) {
      setAuthError(err);
    }
  };

  useErrorTimeout(!!authError, () => setAuthError(false));

  if (IS_PRIVATE_CLOUD) {
    return null;
  }

  return (
    <SocialLoginContainer>
      <FlexApart fullWidth>
        <Button icon="lock" variant={ButtonVariant.SECONDARY} onClick={onSSOLogin} className={cn('social-button', { 'social-button-light': light })}>
          SSO
        </Button>
      </FlexApart>

      {authError && <ErrorMessage>An unexpected error occurred: {authError}</ErrorMessage>}
    </SocialLoginContainer>
  );
};

const mapDispatchToProps = {
  ssoLogin: Session.ssoLogin,
  goToAdoptSSO: Router.goToAdoptSSO,
};

type ConnectedSSOLoginProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(SSOLogin) as React.FC<SSOLoginProps>;
