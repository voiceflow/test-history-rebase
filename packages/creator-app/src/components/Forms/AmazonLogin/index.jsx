import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Button from '@/components/Button';
import { AMAZON_APP_ID } from '@/config';
import * as Account from '@/ducks/account';
import { useAsyncMountUnmount } from '@/hooks';
import { importScript } from '@/utils/dom';
import * as Sentry from '@/vendors/sentry';

const ELEMENT_ID = 'amazon-sdk';
const AWS_LOGIN_URI = '//api-cdn.amazon.com/sdk/login1.js';
const AUTH_OPTIONS = {
  response_type: 'code',
  scope: ['alexa::ask:skills:readwrite', 'alexa::ask:models:readwrite', 'alexa::ask:skills:test', 'profile'].join(' '),
};

export const AmazonLoginButton = (props) => {
  const { onLoad, onFail, onSuccess, disabled = false, linkAmazonAccount } = props;

  useAsyncMountUnmount(async () => {
    await importScript(ELEMENT_ID, AWS_LOGIN_URI, 'onAmazonLoginReady');
    window.amazon.Login.setClientId(AMAZON_APP_ID);
  });

  const triggerLogin = async () => {
    onLoad();
    try {
      window.amazon.Login.authorize(AUTH_OPTIONS, async (response) => {
        try {
          if (response.error) {
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

  return (
    <Button variant="primary" className="LoginWithAmazon" onClick={triggerLogin} disabled={disabled}>
      Connect Amazon
    </Button>
  );
};

AmazonLoginButton.propTypes = {
  onSuccess: PropTypes.func,
  onFail: PropTypes.func,
  onLoad: PropTypes.func,
};

const mapDispatchToProps = {
  linkAmazonAccount: Account.amazon.linkAccount,
};

export default connect(null, mapDispatchToProps)(AmazonLoginButton);
