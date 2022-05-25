import Text from '@ui/components/Text';
import React from 'react';
import { SpaceProps } from 'styled-system';

import { PreviewColors } from '../constants';

const PreviewText: React.FC<SpaceProps> = ({ children, ...props }) => {
  return (
    <Text color={PreviewColors.GREY_TEXT_COLOR} fontSize={13} lineHeight="18px" style={{ wordBreak: 'break-word' }} {...props}>
      {children}
    </Text>
  );
};

export default PreviewText;
