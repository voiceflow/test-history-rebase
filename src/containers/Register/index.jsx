import './Account.css';

import cn from 'classnames';
import React from 'react';

import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const Account = (props) => (
  <div className="d-flex flex-row align-items-center justify-content-center" id="main">
    <div
      className={cn('login-card', {
        'open-register': props.page !== 'login',
      })}
    >
      <div id="side-form">
        <LoginForm history={props.history} location={props.location} />
        <SignupForm history={props.history} location={props.location} />
      </div>
    </div>
  </div>
);

export default Account;
