import { Box } from '@voiceflow/ui';
import React from 'react';

import { ApperanceSection, GeneralSection, PreviewSection, PublishSection } from './sections';
import { PreviewContainer, SettingsContainer } from './styled';

const Webchat: React.FC = () => {
  return (
    <Box display="flex" height="100%">
      <SettingsContainer>
        <GeneralSection />
        <ApperanceSection />
        <PublishSection />
      </SettingsContainer>
      <PreviewContainer>
        <PreviewSection />
      </PreviewContainer>
    </Box>
  );
};

export default Webchat;
