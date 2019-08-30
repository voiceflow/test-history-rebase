import axios from 'axios';
import React, { Component } from 'react';

import Button from '@/componentsV2/Button';
import { AMAZON_APP_ID } from '@/config';

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

const AmazonLogin = () =>
  new Promise((resolve, reject) => {
    const options = { response_type: 'code', scope: 'alexa::ask:skills:readwrite alexa::ask:models:readwrite alexa::ask:skills:test profile' };
    window.amazon.Login.authorize(options, (response) => {
      if (response.error) {
        reject();
      } else {
        axios
          .get(`/session/amazon/${response.code}`)
          .then(() => {
            resolve();
          })
          .catch((err) => {
            console.error(err);
            reject(err);
          });
      }
    });
  });

class NormalButton extends Component {
  constructor(props) {
    super(props);

    this.triggerLogin = this.triggerLogin.bind(this);
  }

  // eslint-disable-next-line react/no-deprecated, class-methods-use-this
  componentWillMount() {
    AmazonLoad();
  }

  triggerLogin() {
    const that = this;
    that.props.updateLogin(1);
    AmazonLogin()
      .then(() => that.props.updateLogin(2))
      .catch(() => that.props.updateLogin(-1));
  }

  render() {
    return (
      <Button variant="primary" className="LoginWithAmazon" onClick={this.triggerLogin}>
        Connect Amazon
      </Button>
    );
  }
}

export default NormalButton;
