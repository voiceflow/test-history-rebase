import { Input } from '@voiceflow/ui';
import React from 'react';

import { ControlProps } from '@/types';
import { withTargetValue } from '@/utils/dom';

export type EmailInputProps = ControlProps<string> & {
  placeholder?: string;
  error?: boolean;
};

const EmailInput: React.FC<EmailInputProps> = ({ value, onChange, placeholder = 'Email', error }) => (
  <Input
    type="email"
    name="email"
    onChange={withTargetValue(onChange)}
    placeholder={placeholder}
    required
    minLength={6}
    value={value}
    error={error}
  />
);

export default EmailInput;
