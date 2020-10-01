import React from 'react';

import Button from '@/components/Button';
import { linkGoogleAccountV2 } from '@/ducks/account/sideEffectsV2';
import { connect } from '@/hocs';
import { useGoogleLogin } from '@/hooks';
import * as Models from '@/models';
import { ConnectedProps } from '@/types';

export type GoogleLoginProps = {
  scopes: string[];
  onFail: () => void;
  onLoad: () => void;
  onSuccess: (account: Models.Account.Google) => void;
};

const GoogleLogin: React.FC<GoogleLoginProps & ConnectedGoogleLoginProps> = ({ scopes, onSuccess, onFail, onLoad, linkGoogleAccountV2 }) => {
  const login = useGoogleLogin(scopes, onLoad);

  const onLogin = React.useCallback(
    () =>
      login()
        .then(async (code) => {
          const account = await linkGoogleAccountV2(code);

          onSuccess(account!);
        })
        .catch(onFail),
    [onSuccess, onFail]
  );

  return (
    <Button variant="primary" className="LoginWithAmazon" onClick={onLogin}>
      Connect Google
    </Button>
  );
};

const mapDispatchToProps = {
  linkGoogleAccountV2,
};

type ConnectedGoogleLoginProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(GoogleLogin) as React.FC<GoogleLoginProps>;
