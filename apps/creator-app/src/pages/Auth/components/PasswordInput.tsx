import { Input } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';

import { ControlProps } from '@/types';

export interface PasswordInputProps extends ControlProps<string> {
  name?: string;
  isInvalid?: boolean;
  minLength?: number;
  placeholder?: string;
  showPassword?: boolean;
  required?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  name = 'password',
  value,
  onChange,
  minLength,
  isInvalid,
  placeholder = 'Password',
  showPassword,
  required = true,
}) => (
  <Input
    type={showPassword ? 'text' : 'password'}
    name={name}
    value={value}
    required={required}
    className={cn({ invalid: isInvalid })}
    minLength={minLength}
    placeholder={placeholder}
    onChangeText={onChange}
  />
);

export default PasswordInput;
