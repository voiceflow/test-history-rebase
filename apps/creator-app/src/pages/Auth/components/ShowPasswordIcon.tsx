import cn from 'classnames';
import React from 'react';

import { eyeHideIcon, eyeIcon } from '@/assets';

export interface ShowPasswordIconProps {
  showPassword: boolean;
  onClick: VoidFunction;
}

const ShowPasswordIcon: React.FC<ShowPasswordIconProps> = ({ showPassword, onClick }) => (
  <img
    onClick={onClick}
    className={cn('viewPassword', { hiddenEye: showPassword })}
    src={showPassword ? eyeHideIcon : eyeIcon}
    alt=""
  />
);

export default ShowPasswordIcon;
