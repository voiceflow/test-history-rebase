import { type IText, Text } from '@voiceflow/ui-next';
import React from 'react';

import { labelStyles } from './FieldLabel.css';

export const FieldLabel: React.FC<IText> = ({ children, ...props }) => {
  return (
    <Text {...props} variant="fieldLabel" className={labelStyles}>
      {children}
    </Text>
  );
};
