import cn from 'classnames';
import React, { useEffect, useState } from 'react';

import Button, { ButtonVariant } from '@/components/Button';
import { FlexApart } from '@/components/Flex';
import { IS_PRIVATE_CLOUD, OKTA_CLIENT_ID, OKTA_DOMAIN, OKTA_SCOPES } from '@/config';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { useTeardown } from '@/hooks';
import { ConnectedProps } from '@/types';
import OKTA from '@/utils/okta';

import { SocialLoginContainer } from './AuthBoxes';

export type SSOLoginProps = {
  light?: boolean;
  coupon?: string;
  disabled?: boolean;
};

const SSOLogin: React.FC<SSOLoginProps & ConnectedSSOLoginProps> = ({ light, coupon, ssoLogin }) => {
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
};

type ConnectedSSOLoginProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(SSOLogin) as React.FC<SSOLoginProps>;
