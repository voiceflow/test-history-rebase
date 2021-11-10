import { Input } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';

import { ControlProps } from '@/types';
import { withTargetValue } from '@/utils/dom';

export type PasswordInputProps = ControlProps<string> & {
  showPassword?: boolean;
  isInvalid?: boolean;
  name?: string;
  minLength?: number;
  placeholder?: string;
};

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  minLength,
  onChange,
  showPassword,
  name = 'password',
  placeholder = 'Password',
  isInvalid,
}) => (
  <Input
    className={cn({ invalid: isInvalid })}
    type={showPassword ? 'text' : 'password'}
    name={name}
    onChange={withTargetValue(onChange)}
    placeholder={placeholder}
    required
    minLength={minLength}
    value={value}
  />
);

export default PasswordInput;
