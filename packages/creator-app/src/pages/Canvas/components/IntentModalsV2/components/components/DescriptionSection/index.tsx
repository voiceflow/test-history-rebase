import { Box } from '@voiceflow/ui';
import React from 'react';

import MentionEditor from '@/components/MentionEditor';
import Section, { SectionToggleVariant, SectionVariant } from '@/components/Section';

interface DescriptionSectionProps {
  handleDescriptionChange: (data: string) => void;
  description: string;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({ handleDescriptionChange, description }) => {
  return (
    <Section headerToggle collapseVariant={SectionToggleVariant.ARROW} header="Description" variant={SectionVariant.PRIMARY} forceDividers>
      <Box paddingBottom={14} minHeight={100}>
        <MentionEditor onChange={handleDescriptionChange} placeholder="Add intent description, or @mention" value={description} height={100} />
      </Box>
    </Section>
  );
};

export default DescriptionSection;
