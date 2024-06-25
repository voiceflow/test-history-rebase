import * as Base from '@platform-config/configs/base';
import React from 'react';

import { ConnectButton } from '../components';
import { GOOGLE_OAUTH_SCOPES } from '../constants';
import { useContext } from '../context';
import type { Account } from '../types';

export interface Props extends Base.Integration.LinkAccountButton.Props {
  onSuccess: (account: Account) => void;
}

export const Component: React.FC<Props> = ({ onError, onSuccess, ...props }) => {
  const context = useContext();

  const onLinkAccount = async (result: { code: string }) => {
    try {
      const account = await context.linkAccount(result.code);

      onSuccess(account);
    } catch (err) {
      onError?.(err);
    }
  };

  return (
    <ConnectButton.Component {...props} scopes={GOOGLE_OAUTH_SCOPES} onError={onError} onSuccess={onLinkAccount} />
  );
};

/**
 * used in the Dialogflow ES/CX platforms
 */
export const CONFIG = Base.Integration.LinkAccountButton.extend({
  Component,
})(Base.Integration.LinkAccountButton.validate);

export type Config = typeof CONFIG;
