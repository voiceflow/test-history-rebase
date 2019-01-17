import React, { Component } from 'react'
import GoogleLogin from 'react-google-login';

import './Skill.css'
import AuthenticationService from '../../../services/Authentication'

const _ = require('lodash');


class GooglePublish extends Component {

  constructor(props) {
    super(props);

    this.state = {
      auth_error: null
    }

    this.googleLogin = this.googleLogin.bind(this)
    this.googleLoginError = this.googleLoginError.bind(this)
  }


  async googleLogin(googleResp) {
    try {
      await AuthenticationService.googlePublishLogin({
        code: googleResp.code,
        creator_id: window.user_detail.id
      })
    } catch (e) {
      this.setState({
        auth_error: e.response.data
      })
    }
    return false;
  }

  googleLoginError(error) {
    this.setState({
      auth_error: error
    })
  }

  render() {
    return (
      <React.Fragment>
        The Google Publish Page

        <GoogleLogin
          clientId='792099969137-uf81ar579b5ea2ll96a37r3ruucfbrmv.apps.googleusercontent.com'
          className="social-button class-ggl mb-2"
          buttonText="Login with Google"
          responseType='code'
          accessType='offline'
          onSuccess={this.googleLogin}
          onFailure={this.googleLoginError}
        />

      </React.Fragment>
    )
  }
}

export default GooglePublish;