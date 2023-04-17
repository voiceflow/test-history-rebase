import { Box, SectionV2, TutorialInfoIcon } from '@voiceflow/ui';
import React from 'react';

import InfoTooltip from './InfoTooltip';

interface SectionProps {
  label: string;
  onClick: VoidFunction;
}

const Section: React.FC<SectionProps> = ({ label, onClick }) => (
  <>
    <SectionV2.Divider />

    <SectionV2.LinkSection onClick={onClick}>
      <Box.Flex gap={16}>
        <SectionV2.Title>{label}</SectionV2.Title>

        <Box mt={1}>
          <TutorialInfoIcon>
            <InfoTooltip label={label} />
          </TutorialInfoIcon>
        </Box>
      </Box.Flex>
    </SectionV2.LinkSection>
  </>
);

export default Section;
