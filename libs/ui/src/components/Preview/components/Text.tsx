import Text from '@ui/components/Text';
import React from 'react';
import { SpaceProps } from 'styled-system';

import { PreviewColors } from '../constants';

const PreviewText: React.FC<React.PropsWithChildren<SpaceProps>> = ({ children, ...props }) => (
  <Text color={PreviewColors.GREY_TEXT_COLOR} fontSize={13} lineHeight="18px" style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }} {...props}>
    {children}
  </Text>
);

export default PreviewText;
