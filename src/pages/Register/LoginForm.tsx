import cn from 'classnames';
import _ from 'lodash';
import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Form, FormGroup, Input } from 'reactstrap';

import Button from '@/components/LegacyButton';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';
import * as Query from '@/utils/query';

import { AuthBox } from './AuthBoxes';
import AuthenticationContainer from './AuthenticationWrapper';
import SocialLogin from './SocialLogin';
import { inviteEmailMatches, replaceSpaceWithPlus } from './utils';

export const LoginForm: React.FC<RouteComponentProps & ConnectedLoginFormProps> = ({ basicAuthLogin, history, location }) => {
  const query = Query.parse(location.search);
  const [loginError, setLoginError] = React.useState<string | false | null>(null);
  const [email, setEmail] = React.useState(query.email ? replaceSpaceWithPlus(query.email) : '');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  let timeout: number | undefined;

  const openRegister = (event: React.MouseEvent) => {
    event.preventDefault();
    history.push(`/signup${location.search}`);
    return false;
  };

  const loginSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (query.invite && !inviteEmailMatches(query, email)) {
      return;
    }
    basicAuthLogin({
      email,
      password,
    }).catch((error) => {
      const errText = _.get(error, ['body', 'data']) || false;
      setLoginError(errText);
    });
    return false;
  };

  React.useEffect(() => {
    timeout = setTimeout(() => {
      setLoginError(false);
    }, 5000);

    return () => clearTimeout(timeout);
  });

  return (
    <AuthenticationContainer>
      <AuthBox>
        <Form onSubmit={loginSubmit}>
          <img className="auth-logo" src="/logo.png" alt="logo" />
          <div className="auth-form-wrapper">
            <FormGroup>
              <Input
                className="form-bg"
                type="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                minLength={6}
                value={email}
              />
            </FormGroup>
            <FormGroup className="passwordInput">
              <Input
                className="form-bg"
                type={showPassword ? 'text' : 'password'}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                minLength={8}
                value={password}
              />
              {password.length !== 0 && (
                // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                <img
                  onClick={() => setShowPassword(!showPassword)}
                  className={cn('viewPassword', { hiddenEye: showPassword })}
                  src={showPassword ? '/eye-hide.svg' : '/eye.svg'}
                  alt=""
                />
              )}
              <Link className="forgotLink" to="/reset">
                Forgot password?
              </Link>
            </FormGroup>
            <div className="row">
              <div className="col-7 auth__link">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a onClick={openRegister}>Don't have an account?</a>
              </div>
              <div className="col-5">
                <Button isPrimary isBlock type="submit">
                  {query.invite ? 'Join Team' : 'Sign in'}
                </Button>
              </div>
            </div>
          </div>
        </Form>
        <SocialLogin entryText="Or sign in with" light />
        {loginError && (
          <div className="errorContainer row">
            <div className="col-1">
              <img src="/error.svg" alt="" />
            </div>
            <div className="col-11">{loginError}</div>
          </div>
        )}
      </AuthBox>
    </AuthenticationContainer>
  );
};

const mapDispatchToProps = {
  basicAuthLogin: Session.basicAuthLogin,
};

type ConnectedLoginFormProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(LoginForm);
