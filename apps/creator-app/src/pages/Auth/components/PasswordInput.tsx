import { Input } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'children'> {
  value: string;
  onChange: (value: string) => void;
  isInvalid?: boolean;
  showPassword?: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ name = 'password', required = true, onChange, isInvalid, placeholder = 'Password', showPassword, ...props }, ref) => (
    <Input
      {...props}
      ref={ref}
      type={showPassword ? 'text' : 'password'}
      name={name}
      required={required}
      className={cn({ invalid: isInvalid })}
      placeholder={placeholder}
      onChangeText={onChange}
    />
  )
);

export default PasswordInput;
