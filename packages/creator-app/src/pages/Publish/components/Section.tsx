import { Box } from '@voiceflow/ui';
import React from 'react';

import { styled } from '@/hocs';

const SectionCard = styled(Box)`
  border-radius: 5px;
  box-shadow: 0 1px 3px 0 rgba(17, 49, 96, 0.08), 0 0 1px 1px rgba(17, 49, 96, 0.08);
  background-color: white;
  padding: 24px 32px;

  color: ${({ theme }) => theme.colors.secondary};
`;

const Section: React.FC<{ title?: string; card?: boolean }> = ({ title, children, card = true }) => (
  <Box width="100%" p={12}>
    <Box fontWeight={600} mb={16}>
      {title}
    </Box>
    {card ? <SectionCard>{children}</SectionCard> : children}
  </Box>
);

export default Section;
