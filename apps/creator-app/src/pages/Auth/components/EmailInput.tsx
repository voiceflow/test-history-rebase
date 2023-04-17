import { Input } from '@voiceflow/ui';
import React from 'react';

import { ControlProps } from '@/types';

export interface EmailInputProps extends ControlProps<string> {
  error?: boolean;
  placeholder?: string;
}

const EmailInput: React.FC<EmailInputProps> = ({ value, onChange, placeholder = 'Email', error }) => (
  <Input type="email" name="email" value={value} error={error} onChangeText={onChange} placeholder={placeholder} required minLength={6} />
);

export default EmailInput;
