import React from 'react';

import { facebookLogo } from '@/assets';

import SocialButton from './SocialButton';

export interface FacebookSocialButtonProps {
  light?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

const FacebookSocialButton: React.FC<FacebookSocialButtonProps> = ({ light, disabled, onClick }) => (
  <SocialButton onClick={!disabled && onClick} light={light}>
    <img src={facebookLogo} alt="Facebook Login" />
    Facebook
  </SocialButton>
);

export default FacebookSocialButton;
