import type { TextProps } from '@voiceflow/ui';
import { BlockText, Text } from '@voiceflow/ui';
import React from 'react';

export interface LabelProps extends TextProps, React.PropsWithChildren {
  color?: string;
  fontSize?: number;
  fontWeight?: number;
  inline?: boolean;
}

const Label: React.FC<LabelProps> = ({
  color = '#62778c',
  fontSize = 15,
  fontWeight = 600,
  inline = false,
  children,
  ...props
}) =>
  inline ? (
    <Text fontWeight={fontWeight} color={color} fontSize={fontSize} {...props}>
      {children}
    </Text>
  ) : (
    <BlockText mb={11} fontWeight={fontWeight} color={color} fontSize={fontSize} {...props}>
      {children}
    </BlockText>
  );

export default Label;
