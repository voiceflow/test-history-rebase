import { Box } from '@voiceflow/ui';
import React from 'react';

import { SectionCard } from '@/pages/Publish/components/index';

const Section: React.FC<{ title?: string; card?: boolean }> = ({ title, children, card = true }) => (
  <Box width="100%" m={12}>
    <Box fontWeight={600} mb={16}>
      {title}
    </Box>
    {card ? <SectionCard>{children}</SectionCard> : children}
  </Box>
);

export default Section;
