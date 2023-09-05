import { Box, Header, type ITabLoader, TabLoader } from '@voiceflow/ui-next';
import React from 'react';

import { CMSHeader } from './CMSHeader/CMSHeader.component';

export const CMSPageLoader: React.FC<ITabLoader> = ({ variant = 'dark', ...props }) => (
  <Box width="100%" height="100%" direction="column">
    <CMSHeader searchPlaceholder="Search" createButton={<Header.Button.Primary label="New" onClick={() => null} disabled />} />
    <TabLoader variant={variant} {...props} />
  </Box>
);
