import cn from 'classnames';
import React from 'react';

export type ShowPasswordIconProps = {
  showPassword: boolean;
  onClick: VoidFunction;
};

const ShowPasswordIcon: React.FC<ShowPasswordIconProps> = ({ showPassword, onClick }) => (
  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
  <img onClick={onClick} className={cn('viewPassword', { hiddenEye: showPassword })} src={showPassword ? '/eye-hide.svg' : '/eye.svg'} alt="" />
);

export default ShowPasswordIcon;
