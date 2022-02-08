import { Button, ButtonVariant, FlexApart, Input, Link } from '@voiceflow/ui';
import _get from 'lodash/get';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Form, FormGroup } from 'reactstrap';

import { errorIcon, wordmark } from '@/assets';
import * as AccountV2 from '@/ducks/accountV2';

import { AuthBox } from './AuthBoxes';
import AuthenticationContainer from './AuthenticationWrapper';
import SocialLogin from './SocialLogin';

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const [params] = useSearchParams();

  const [email, setEmail] = useState(params.get('email') ?? '');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await dispatch(AccountV2.login({ email, password }));
    } catch (error) {
      const errText = _get(error, ['body', 'data']) || error;

      setLoginError(errText);
    }
  };

  useEffect(() => {
    if (!loginError) {
      return undefined;
    }

    const timeout = setTimeout(() => setLoginError(''), 5000);

    return () => clearTimeout(timeout);
  }, [loginError]);

  return (
    <AuthenticationContainer>
      <AuthBox>
        <Form onSubmit={onSubmit}>
          <div className="logo">
            <img className="auth-logo" src={wordmark} alt="logo" />
            <div className="admin-icon">Internal</div>
          </div>

          <div className="auth-form-wrapper">
            <FormGroup>
              <Input
                className="form-bg"
                type="email"
                name="email"
                onChange={({ currentTarget }) => setEmail(currentTarget.value)}
                placeholder="Email"
                required
                minLength={6}
                value={email}
              />
            </FormGroup>

            <FormGroup className="passwordInput">
              <Input
                className="form-bg"
                type="password"
                name="password"
                onChange={({ currentTarget }) => setPassword(currentTarget.value)}
                placeholder="Password"
                required
                minLength={8}
                value={password}
              />
            </FormGroup>

            <FlexApart>
              <div className="auth__link">
                <Link href="https://creator.voiceflow.com">Back to voiceflow</Link>
              </div>

              <div>
                <Button variant={ButtonVariant.PRIMARY} type="submit">
                  Log in
                </Button>
              </div>
            </FlexApart>
          </div>
        </Form>

        <SocialLogin entryText="Or sign in with" light />

        {loginError && (
          <div className="errorContainer row">
            <div className="col-1">
              <img src={errorIcon} alt="" />
            </div>
            <div className="col-11">{loginError}</div>
          </div>
        )}
      </AuthBox>
    </AuthenticationContainer>
  );
};

export default LoginForm;
