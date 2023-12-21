import { type IText, Text, Tokens } from '@voiceflow/ui-next';
import React from 'react';

export const KBFieldLabel: React.FC<IText> = ({ children, ...props }) => (
  <Text color={Tokens.colors.neutralDark.neutralsDark100} {...props} variant="fieldLabel">
    {children}
  </Text>
);
