import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

interface SectionProps {
  onClick: VoidFunction;
}

const Section: React.FC<SectionProps> = ({ onClick }) => (
  <>
    <SectionV2.Divider />

    <SectionV2.LinkSection onClick={onClick}>
      <SectionV2.Title>No match</SectionV2.Title>
    </SectionV2.LinkSection>
  </>
);

export default Section;
