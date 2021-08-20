import { Button, ButtonVariant, preventDefault, toast } from '@voiceflow/ui';
import { getSearch } from 'connected-react-router';
import _get from 'lodash/get';
import React from 'react';
import { Link } from 'react-router-dom';

import { wordmark } from '@/assets';
import { IS_PRIVATE_CLOUD } from '@/config';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { useSetup, useToggle } from '@/hooks';
import { Query } from '@/models';
import HeaderBox from '@/pages/Auth/components/HeaderBox';
import perf, { PerfAction } from '@/performance';
import { ConnectedProps, MergeArguments } from '@/types';

import { replaceSpaceWithPlus } from '../utils';
import { AuthBox } from './AuthBoxes';
import AuthenticationContainer from './AuthenticationContainer';
import EmailInput from './EmailInput';
import InputContainer from './InputContainer';
import PasswordInput from './PasswordInput';
import ShowPasswordIcon from './ShowPasswordIcon';

export interface LoginFormProps {
  query: Query.Auth;
}

export const LoginForm: React.FC<LoginFormProps & ConnectedLoginFormProps> = ({ basicAuthLogin, goToSignup, query, children }) => {
  const [email, setEmail] = React.useState(query.email ? replaceSpaceWithPlus(query.email)! : '');
  const [password, setPassword] = React.useState('');
  const [showPassword, toggleShowPassword] = useToggle();

  const loginSubmit = () =>
    basicAuthLogin({
      email,
      password,
    }).catch((error) => {
      const errText = _get(error, ['body', 'data']) || false;
      toast.error(errText);
    });

  useSetup(() => {
    perf.action(PerfAction.LOGIN_RENDERED);
  });

  return (
    <AuthenticationContainer>
      <AuthBox>
        <form onSubmit={preventDefault(loginSubmit)}>
          <img className="auth-logo" src={wordmark} alt="logo" />
          <div className="auth-form-wrapper">
            <HeaderBox>
              <h1>Log In to your account</h1>
            </HeaderBox>
            <InputContainer>
              <EmailInput value={email} onChange={setEmail} />
            </InputContainer>
            <InputContainer className="passwordInput">
              <PasswordInput value={password} onChange={setPassword} showPassword={showPassword} />
              {password.length !== 0 && <ShowPasswordIcon showPassword={showPassword} onClick={() => toggleShowPassword()} />}
              <Link className="forgotLink" to="/reset">
                Forgot password?
              </Link>
            </InputContainer>
            <div className="row">
              <div className="col-7 auth__link">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                {IS_PRIVATE_CLOUD ? <span /> : <a onClick={goToSignup}>Don't have an account?</a>}
              </div>
              <div className="col-5">
                <Button variant={ButtonVariant.PRIMARY} type="submit">
                  {query.invite ? 'Join Team' : 'Log In'}
                </Button>
              </div>
            </div>
          </div>
        </form>

        {children}
      </AuthBox>
    </AuthenticationContainer>
  );
};

const mapStateToProps = {
  search: getSearch,
};

const mapDispatchToProps = {
  basicAuthLogin: Session.basicAuthLogin,
  goToSignup: Router.goToSignup,
};

const mergeProps = (...[{ search }, { goToSignup }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchToProps>) => ({
  goToSignup: () => goToSignup(search),
});

type ConnectedLoginFormProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(LoginForm) as React.FC<LoginFormProps>;
