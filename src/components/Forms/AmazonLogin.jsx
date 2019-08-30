import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Button from '@/componentsV2/Button';
import { AMAZON_APP_ID } from '@/config';
import { createAmazonSession } from '@/ducks/account';

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
  const { onLoad, onFail, onSuccess, createAmazonSession } = props;
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
          await createAmazonSession(response.code);
          onSuccess();
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

export default connect(
  null,
  { createAmazonSession }
)(AmazonLoginButton);
