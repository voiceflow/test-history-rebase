import React, { useState, useEffect, Fragment} from 'react'
import {googleClient, fbId} from './social-id.js';
import { googleLogin, fbLogin } from 'ducks/account'
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login'
import ErrorWidget from './ErrorWidget'
import { connect } from 'react-redux';

const SocialLogin = ({entryText, googleLogin, fbLogin}) => {
  const [authError, setAuthError] = useState(null)
  let timeout

  const triggerGoogleLogin = (userProfile) => {
    googleLogin({
      name: userProfile.profileObj.name,
      email: userProfile.profileObj.email,
      googleId: userProfile.profileObj.googleId,
      token: userProfile.tokenId,
    })
    .catch(err => {
      setAuthError(err.response.data)
    })
    return false;
  }

  const triggerFbLogin = (fbUser) => {
    fbLogin({
    name: fbUser.name,
    email: fbUser.email,
    fbId: fbUser.id,
    code: fbUser.accessToken,
    uri: window.location.href,
    })
    .catch(err => {
      setAuthError(err.response.data)
    })
    return false;
  }

  useEffect(() => {
    timeout = setTimeout(() => {
      setAuthError(false)
    }, 5000)

    return () => clearTimeout(timeout)
  })

  return (
  <Fragment>
    <ErrorWidget error={authError} color="danger"/>
    <div className="social-login">
      <GoogleLogin
        clientId={googleClient}
        className="social-button class-ggl mb-2"
        buttonText={`${entryText} with Google`}
        onSuccess={triggerGoogleLogin}
      />
      <FacebookLogin
        appId={fbId}
        cssClass="social-button class-fb"
        icon="fa-facebook"
        fields="name,email"
        buttonText={`${entryText} with Facebook`}
        callback={triggerFbLogin}
      />
      <div className="break">
        <span className="or">
          OR
        </span>
      </div>
    </div>
  </Fragment>
  )
}

const mapDispatchToProps = dispatch => ({
  fbLogin: (user) => dispatch(fbLogin(user)),
  googleLogin: (user) => dispatch(googleLogin(user))
})

export default connect(null, mapDispatchToProps)(SocialLogin)

