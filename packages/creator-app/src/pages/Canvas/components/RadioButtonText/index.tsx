import { Text } from '@voiceflow/ui';
import React from 'react';

export interface RadioButtonTextProps {
  label: string;
}

const RadioButtonText: React.FC<RadioButtonTextProps> = ({ label }) => (
  <Text fontWeight="normal" color="#132144">
    {label}
  </Text>
);

export default RadioButtonText;
