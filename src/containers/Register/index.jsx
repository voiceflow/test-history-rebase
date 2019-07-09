import './Account.css';

import cn from 'classnames';
import React from 'react';

import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const Account = ({ page, history, location }) => {
  return (
    <div className="d-flex flex-row align-items-center justify-content-center" id="main">
      <div
        className={cn('login-card', {
          'open-register': page !== 'login',
        })}
      >
        <div id="side-form">
          <LoginForm history={history} location={location} />
          <SignupForm history={history} location={location} />
        </div>
      </div>
    </div>
  );
};

export default Account;
