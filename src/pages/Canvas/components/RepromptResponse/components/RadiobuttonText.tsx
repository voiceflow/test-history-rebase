import React from 'react';

import { Text } from '@/components/Text';

export type RadiobuttonTextProps = {
  label: string;
};

const RadiobuttonText = ({ label }: RadiobuttonTextProps) => (
  <Text fontWeight="normal" color="#132144">
    {label}
  </Text>
);

export default RadiobuttonText;
