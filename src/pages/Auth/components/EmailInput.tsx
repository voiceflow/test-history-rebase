import React from 'react';

import Input from '@/components/Input';
import { ControlProps } from '@/types';
import { getTargetValue } from '@/utils/dom';

export type EmailInputProps = ControlProps<string> & {
  placeholder?: string;
};

const EmailInput: React.FC<EmailInputProps> = ({ value, onChange, placeholder = 'Email' }) => (
  <Input type="email" name="email" onChange={getTargetValue(onChange)} placeholder={placeholder} required minLength={6} value={value} />
);

export default EmailInput;
