import { Box, Button, ButtonVariant, ClickableText, preventDefault, TippyTooltip, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks/realtime';
import { PASSWORD_REGEXES, PasswordInput, PasswordVerification } from '@/pages/Auth/components';

import { ResetPasswordStage } from '../constants';

const verifyPassword = (password: string) => PASSWORD_REGEXES.every((regex) => password.match(regex));

export interface ResetPasswordFormProps {
  resetCode: string;
  setStage: (stage: ResetPasswordStage) => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ resetCode, setStage }) => {
  const goToLogin = useDispatch(Router.goToLogin);

  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [isValid, setIsValid] = React.useState(true);

  const resetPassword = async () => {
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }

    if (!verifyPassword(password)) {
      setIsValid(false);
      return;
    }

    setStage(ResetPasswordStage.PENDING);

    try {
      await client.identity.user.resetPassword(resetCode, password);

      setStage(ResetPasswordStage.SUCCESSFUL);
    } catch {
      toast.error('Whoops, something went wrong with the server');
      setStage(ResetPasswordStage.FAILED);
    }
  };

  return (
    <form onSubmit={preventDefault(resetPassword)} className="w-100">
      <Box mb={22}>
        <TippyTooltip
          offset={[0, 5]}
          visible={!!password && !isValid && !verifyPassword(password)}
          content={<PasswordVerification password={password} />}
          placement="bottom-start"
        >
          <PasswordInput value={password} required={false} onChange={setPassword} placeholder="New Password" />
        </TippyTooltip>
      </Box>
      <Box mb={22}>
        <PasswordInput value={confirm} onChange={setConfirm} name="confirm" placeholder="Confirm Password" isInvalid={password !== confirm} />
      </Box>

      <Box.FlexApart mt={32}>
        <div className="auth__link">
          <ClickableText onClick={() => goToLogin()}>Back to Signing in</ClickableText>
        </div>

        <div>
          <Button variant={ButtonVariant.PRIMARY} type="submit">
            Update Password
          </Button>
        </div>
      </Box.FlexApart>
    </form>
  );
};

export default ResetPasswordForm;
