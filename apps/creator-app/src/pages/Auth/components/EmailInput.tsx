import { Input } from '@voiceflow/ui';
import React from 'react';

export interface EmailInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'children'> {
  value: string;
  error?: boolean;
  onChange: (value: string) => void;
}

const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>(
  ({ error, value, onChange, placeholder = 'Email', required = true, minLength = 6, ...props }, ref) => (
    <Input
      {...props}
      ref={ref}
      type="email"
      name="email"
      value={value}
      error={error}
      onChangeText={onChange}
      placeholder={placeholder}
      required={required}
      minLength={minLength}
    />
  )
);

export default EmailInput;
