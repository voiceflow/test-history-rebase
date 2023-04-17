import React from 'react';

import { googleLogo } from '@/assets';

import SocialButton from './SocialButton';

export interface GoogleSocialButtonProps {
  light?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

const GoogleSocialButton: React.FC<GoogleSocialButtonProps> = ({ light, disabled, onClick }) => (
  <SocialButton onClick={!disabled && onClick} light={light}>
    <img src={googleLogo} alt="Google Login" />
    Google
  </SocialButton>
);

export default GoogleSocialButton;
