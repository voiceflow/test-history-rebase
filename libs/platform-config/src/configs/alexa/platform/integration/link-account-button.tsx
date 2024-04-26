import * as Base from '@platform-config/configs/base';
import React from 'react';

import { ConnectButton } from '../components';
import { useContext } from '../context';
import type { Account } from '../types';

export interface Props extends Base.Integration.LinkAccountButton.Props {
  onSuccess: (account: Account) => void;
}

const AUTH_OPTIONS: CodeAuthorizeOptions = {
  scope: ['alexa::ask:skills:readwrite', 'alexa::ask:models:readwrite', 'alexa::ask:skills:test', 'profile'].join(
    ' '
  ) as AuthorizeScope,
  response_type: 'code',
};

export const Component: React.FC<Props> = ({ onError, onSuccess, ...props }) => {
  const context = useContext();

  const onLinkAccount = async (result: CodeRequest) => {
    try {
      const account = await context.linkAccount(result.code);

      onSuccess(account);
    } catch (err) {
      onError?.(err);
    }
  };

  return <ConnectButton.Component {...props} onError={onError} onSuccess={onLinkAccount} authOptions={AUTH_OPTIONS} />;
};

export const CONFIG = Base.Integration.LinkAccountButton.extend({
  Component,
})(Base.Integration.LinkAccountButton.validate);

export type Config = typeof CONFIG;
