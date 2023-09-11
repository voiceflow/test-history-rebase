import { Box, Scroll } from '@voiceflow/ui-next';
import React from 'react';

import type { ICMSFormScrollSection } from './CMSFormScrollSection.interface';

export const CMSFormScrollSection: React.FC<ICMSFormScrollSection> = ({ pb, header, children, minHeight, ...props }) => (
  <Box pt={11} pb={pb} direction="column" minHeight={minHeight} maxHeight="100%" overflow="hidden" {...props}>
    {header}

    <Scroll>
      <div>{children}</div>
    </Scroll>
  </Box>
);
