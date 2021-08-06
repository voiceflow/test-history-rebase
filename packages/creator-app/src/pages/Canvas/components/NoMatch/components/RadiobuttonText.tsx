import { Text } from '@voiceflow/ui';
import React from 'react';

export interface RadiobuttonTextProps {
  label: string;
}

const RadiobuttonText = ({ label }: RadiobuttonTextProps) => (
  <Text fontWeight="normal" color="#132144">
    {label}
  </Text>
);

export default RadiobuttonText;
