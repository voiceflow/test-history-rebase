import { Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import { AMAZON_APP_ID } from '@/config';
import * as Account from '@/ducks/account';
import { useAsyncMountUnmount, useDispatch } from '@/hooks';
import { importScript } from '@/utils/dom';
import * as Sentry from '@/vendors/sentry';

import { PlatformAccount } from '../types';

const ELEMENT_ID = 'amazon-sdk';
const AWS_LOGIN_URI = '//api-cdn.amazon.com/sdk/login1.js';

const AUTH_OPTIONS: CodeAuthorizeOptions = {
  response_type: 'code',
  scope: 'profile',
};

interface Props {
  onSuccess: (account: PlatformAccount) => void;
  onFail: VoidFunction;
  onLoad: VoidFunction;
  disabled?: boolean;
}

const AmazonLoginButton: React.FC<Props> = ({ onLoad, onFail, onSuccess, disabled = false }) => {
  const linkAmazonAccount = useDispatch(Account.amazon.linkAccount);

  const triggerLogin = async () => {
    onLoad();

    try {
      window.amazon?.Login.authorize(AUTH_OPTIONS, async (response: CodeRequest) => {
        try {
          if (response?.error) {
            throw new Error();
          }

          const account = await linkAmazonAccount(response.code);

          onSuccess(account);
        } catch (err) {
          onFail();
        }
      });
    } catch (err) {
      Sentry.error(err);
      onFail();
    }
  };

  useAsyncMountUnmount(async () => {
    await importScript(ELEMENT_ID, AWS_LOGIN_URI, 'onAmazonLoginReady');

    window.amazon?.Login.setClientId(AMAZON_APP_ID);
  });

  return (
    <Button variant={ButtonVariant.PRIMARY} className="LoginWithAmazon" onClick={triggerLogin} disabled={disabled}>
      Connect Amazon
    </Button>
  );
};

export default AmazonLoginButton;
