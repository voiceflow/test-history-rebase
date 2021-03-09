import cn from 'classnames';
import React from 'react';
import { Input } from 'reactstrap';

import { ControlProps } from '@/types';
import { getTargetValue } from '@/utils/dom';

export type PasswordInputProps = ControlProps<string> & {
  showPassword?: boolean;
  isInvalid?: boolean;
  name?: string;
  placeholder?: string;
};

const PasswordInput: React.FC<PasswordInputProps> = ({ value, onChange, showPassword, name = 'password', placeholder = 'Password', isInvalid }) => (
  <Input
    className={cn('form-bg', { invalid: isInvalid })}
    type={showPassword ? 'text' : 'password'}
    name={name}
    onChange={getTargetValue(onChange)}
    placeholder={placeholder}
    required
    minLength={8}
    value={value}
  />
);

export default PasswordInput;
