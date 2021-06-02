import React from 'react';

import Text from '@/components/Text';
import { BlockText, TextProps } from '@/components/Text/components/Text';

export type LabelProps = TextProps & {
  color?: string;
  fontSize?: number;
  fontWeight?: number;
  inline?: boolean;
};

const Label: React.FC<LabelProps> = ({ color = '#62778c', fontSize = 15, fontWeight = 600, inline = false, children, ...props }) =>
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
