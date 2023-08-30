import { Box } from '@voiceflow/ui';
import React from 'react';

import { IS_PRIVATE_CLOUD } from '@/config';
import * as Session from '@/ducks/session';
import { useDispatch } from '@/hooks';
import THEME from '@/styles/theme';

import { SocialLoginContainer } from './AuthBoxes';
import FacebookSocialButton from './FacebookSocialButton';
import GoogleSocialButton from './GoogleSocialButton';

export interface SocialLoginProps {
  light?: boolean;
  disabled?: boolean;
  loginMode?: boolean;
}

const SocialLogin: React.FC<SocialLoginProps> = ({ light, disabled, loginMode }) => {
  const googleLogin = useDispatch(Session.googleLogin);
  const facebookLogin = useDispatch(Session.facebookLogin);

  if (IS_PRIVATE_CLOUD) {
    return null;
  }

  return (
    <SocialLoginContainer>
      <Box.Flex>
        <Box color={loginMode ? THEME.colors.secondary : THEME.colors.tertiary} mr={16}>
          {loginMode ? 'Or log in with' : 'Or sign up with'}
        </Box>

        <GoogleSocialButton light={light} onClick={googleLogin} disabled={disabled} />
        <FacebookSocialButton light={light} onClick={facebookLogin} disabled={disabled} />
      </Box.Flex>
    </SocialLoginContainer>
  );
};

export default SocialLogin;
