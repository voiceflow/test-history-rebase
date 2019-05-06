import cn from 'classnames'
import React from 'react'
import SignupForm from './SignupForm'
import LoginForm from './LoginForm'
import './Account.css'

const Account = props => (
  <div className="d-flex flex-row align-items-center justify-content-center" id="main">
    <div className={cn('login-card', {
      'open-register': props.page !== 'login'
    })}>
        <div id="side-form">
          <LoginForm history={props.history} location={props.location} />
          <SignupForm history={props.history} location={props.location} />
        </div>
    </div>
  </div>
);

export default Account
