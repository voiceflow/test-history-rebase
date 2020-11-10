import React from 'react';

import BaseButton from '@/components/Button/components/BaseButton';
import SvgIcon from '@/components/SvgIcon';
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

export type GoogleLoginProps = {
  scopes: string[];
  onFail: () => void;
  onLoad: () => void;
  onSuccess: (account: Models.Account.Google) => void;
};

const GoogleLogin: React.FC<GoogleLoginProps & ConnectedGoogleLoginProps> = ({ scopes, onSuccess, onFail, onLoad, linkGoogleAccount }) => {
  const login = useGoogleLogin(scopes, onLoad);

  const onLogin = React.useCallback(
    () =>
      login()
        .then(async (code) => {
          const account = await linkGoogleAccount(code);

          onSuccess(account!);
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
