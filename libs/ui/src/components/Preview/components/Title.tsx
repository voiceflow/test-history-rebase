import Text from '@ui/components/Text';
import React from 'react';
import type { SpaceProps } from 'styled-system';

import { PreviewColors } from '../constants';

const PreviewTitle: React.FC<React.PropsWithChildren<SpaceProps>> = ({ children, ...props }) => (
  <Text color={PreviewColors.GREY_TITLE_COLOR} fontSize={13} fontWeight={600} {...props}>
    {children}
  </Text>
);

export default PreviewTitle;
