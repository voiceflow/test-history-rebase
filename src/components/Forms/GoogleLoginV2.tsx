import React from 'react';

import BaseButton from '@/components/Button/components/BaseButton';
import SvgIcon from '@/components/SvgIcon';
import { GooglePromptType } from '@/constants';
import { linkGoogleAccount } from '@/ducks/account';
import { connect, styled } from '@/hocs';
import { useGoogleLogin } from '@/hooks';
import * as Models from '@/models';
import { ConnectedProps } from '@/types';

const GoogleLoginButton = styled(BaseButton)`
  position: relative;
  background: #4285f4;
  color: #fff;
  font-family: 'Roboto', sans-serif;
  height: 40px;
  border-radius: 2px;

  span:last-of-type {
    padding: 0 22px 0 18px;
  }
`;

type AccountCallback = (account: Models.Account.Google) => void;
type LoginDataCallback = (loginData: { code: string }) => void;

export type GoogleLoginProps = {
  scopes: string[];
  onFail: () => void;
  onLoad?: () => void;
  onSuccess: AccountCallback | LoginDataCallback;
  skipLinkGoogleAccount?: boolean;
};

const GoogleLogin: React.FC<GoogleLoginProps & ConnectedGoogleLoginProps> = ({
  scopes,
  onSuccess,
  onFail,
  onLoad,
  linkGoogleAccount,
  skipLinkGoogleAccount,
}) => {
  const login = useGoogleLogin(scopes, onLoad, GooglePromptType.CONSENT);

  const onLogin = React.useCallback(
    () =>
      login()
        .then(async (code) => {
          if (skipLinkGoogleAccount) {
            (onSuccess as LoginDataCallback)({ code });
            return;
          }

          const account = await linkGoogleAccount(code);

          (onSuccess as AccountCallback)(account!);
        })
        .catch(onFail),
    [onSuccess, onFail]
  );

  return (
    <GoogleLoginButton className="LoginWithGoogle" onClick={onLogin}>
      <SvgIcon icon="connectGoogle" size={46} />
      <span>Sign in with Google</span>
    </GoogleLoginButton>
  );
};

const mapDispatchToProps = {
  linkGoogleAccount,
};

type ConnectedGoogleLoginProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(GoogleLogin) as React.FC<GoogleLoginProps>;
