import Text from '@ui/components/Text';
import React from 'react';
import { SpaceProps } from 'styled-system';

import { PreviewColors } from '../constants';

const PreviewTitle: React.OldFC<SpaceProps> = ({ children, ...props }) => (
  <Text color={PreviewColors.GREY_TITLE_COLOR} fontSize={13} fontWeight={600} {...props}>
    {children}
  </Text>
);

export default PreviewTitle;
