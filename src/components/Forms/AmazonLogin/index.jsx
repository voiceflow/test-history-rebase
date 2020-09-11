import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Button from '@/components/Button';
import { AMAZON_APP_ID } from '@/config';
import { FeatureFlag } from '@/config/features';
import * as Account from '@/ducks/account';
import { linkAmazonAccountV2 } from '@/ducks/account/sideEffectsV2';
import { useFeature } from '@/hooks';

const AmazonLoad = () =>
  new Promise((resolve) => {
    // @TODO: handle errors
    if (document.getElementById('amazon-sdk')) {
      return resolve();
    }

    const firstJS = document.getElementsByTagName('script')[0];
    const js = document.createElement('script');

    js.src = '//api-cdn.amazon.com/sdk/login1.js';
    js.id = 'amazon-sdk';
    js.async = true;

    window.onAmazonLoginReady = () => {
      window.amazon.Login.setClientId(AMAZON_APP_ID);

      return resolve();
    };
    if (!firstJS) {
      document.head.appendChild(js);
    } else {
      firstJS.parentNode.appendChild(js);
    }
  });

export const AmazonLoginButton = (props) => {
  const { onLoad, onFail, onSuccess, createAmazonSession, linkAmazonAccountV2 } = props;

  const dataRefactor = useFeature(FeatureFlag.DATA_REFACTOR);

  useEffect(() => {
    AmazonLoad();
  }, []);

  const triggerLogin = async () => {
    onLoad();
    try {
      const options = { response_type: 'code', scope: 'alexa::ask:skills:readwrite alexa::ask:models:readwrite alexa::ask:skills:test profile' };
      window.amazon.Login.authorize(options, async (response) => {
        try {
          if (response.error) {
            throw new Error();
          }

          const account = await (dataRefactor.isEnabled ? linkAmazonAccountV2(response.code) : createAmazonSession(response.code));

          onSuccess(account);
        } catch (err) {
          onFail();
        }
      });
    } catch (err) {
      console.error(err);
      onFail();
    }
  };

  return (
    <Button variant="primary" className="LoginWithAmazon" onClick={triggerLogin}>
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
  createAmazonSession: Account.createAmazonSession,
  linkAmazonAccountV2,
};

export default connect(null, mapDispatchToProps)(AmazonLoginButton);
