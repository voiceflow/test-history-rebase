import { BaseButton, SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';

import { GooglePromptType } from '@/constants';
import * as Account from '@/ducks/account';
import { styled } from '@/hocs/styled';
import { useDispatch, useGoogleLogin } from '@/hooks';
import * as Models from '@/models';
import logger from '@/utils/logger';

const GoogleLoginButton = styled(BaseButton)`
  position: relative;
  height: 40px;
  color: #fff;
  background: #4285f4;
  border-radius: 2px;

  span:last-of-type {
    padding: 0 22px 0 18px;
  }
`;

type AccountCallback = (account: Models.Account.Google) => void;
type LoginDataCallback = (loginData: { code: string }) => void;

export interface GoogleLoginProps {
  scopes: string[];
  onFail: () => void;
  onLoad?: () => void;
  onSuccess: AccountCallback | LoginDataCallback;
  skipLinkGoogleAccount?: boolean;
}

const GoogleLogin: React.FC<GoogleLoginProps> = ({ scopes, onSuccess, onFail, onLoad, skipLinkGoogleAccount }) => {
  const linkGoogleAccount = useDispatch(Account.google.linkAccount);
  const login = useGoogleLogin(scopes, onLoad, GooglePromptType.CONSENT);

  const onLogin = React.useCallback(
    () =>
      login()
        .then(async (code) => {
          // eslint-disable-next-line promise/always-return
          if (skipLinkGoogleAccount) {
            (onSuccess as LoginDataCallback)({ code });
            return;
          }

          const account = await linkGoogleAccount(code);

          (onSuccess as AccountCallback)(account!);
        })
        .catch((error) => {
          logger.error(error);
          onFail();
        }),
    [onSuccess, onFail]
  );

  return (
    <GoogleLoginButton className="LoginWithGoogle" onClick={onLogin}>
      <SvgIcon icon="connectGoogle" size={46} />
      <Text fontWeight={600}>Sign in with Google</Text>
    </GoogleLoginButton>
  );
};

export default GoogleLogin;
