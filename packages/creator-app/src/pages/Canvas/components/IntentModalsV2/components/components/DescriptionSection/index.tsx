import { Box, useToggle } from '@voiceflow/ui';
import React from 'react';

import Divider from '@/components/Divider';
import MentionEditor from '@/components/MentionEditor';
import { SectionToggleVariant, SectionVariant, UncontrolledSection } from '@/components/Section';

interface DescriptionSectionProps {
  handleDescriptionChange: (data: string) => void;
  description: string;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({ handleDescriptionChange, description }) => {
  const [isCollapsed, toggleIsCollapsed] = useToggle(true);

  const headerStyling = { paddingBottom: isCollapsed ? undefined : '16px' };

  return (
    <>
      <UncontrolledSection
        headerToggle
        collapseVariant={SectionToggleVariant.ARROW}
        header="Description"
        variant={SectionVariant.PRIMARY}
        forceDividers
        isCollapsed={isCollapsed}
        toggle={toggleIsCollapsed}
        customHeaderStyling={headerStyling}
      >
        <Box paddingBottom={14} minHeight={100}>
          <MentionEditor onChange={handleDescriptionChange} placeholder="Add intent description, or @mention" value={description} height={100} />
        </Box>
      </UncontrolledSection>
      {isCollapsed && <Divider style={{ margin: 0, background: '#eaeff4' }} />}
    </>
  );
};

export default DescriptionSection;
