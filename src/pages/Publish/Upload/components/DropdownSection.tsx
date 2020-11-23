import React from 'react';

import Box from '@/components/Box';
import Section, { SectionToggleVariant, SectionVariant } from '@/components/Section';

type DropdownSectionProps = {
  title?: string;
  isDividerBottom?: boolean;
};

const DropdownSection: React.FC<DropdownSectionProps> = ({ title, isDividerBottom, children }) => {
  return (
    <Section
      header={title}
      headerToggle
      collapseVariant={SectionToggleVariant.ARROW}
      initialOpen={false}
      variant={SectionVariant.UPLOAD}
      customContentStyling={{ padding: '0 30px 0 0' }}
      isDividerBottom={isDividerBottom}
      customHeaderStyling={{ paddingRight: '32px' }}
    >
      <Box mb={16} style={{ textAlign: 'left' }}>
        {children}
      </Box>
    </Section>
  );
};

export default DropdownSection;
