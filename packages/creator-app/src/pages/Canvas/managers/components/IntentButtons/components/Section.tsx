import { BoxFlex, SectionV2, TutorialInfoIcon } from '@voiceflow/ui';
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
      <BoxFlex>
        <SectionV2.Title>{label}</SectionV2.Title>

        <TutorialInfoIcon>
          <InfoTooltip label={label} />
        </TutorialInfoIcon>
      </BoxFlex>
    </SectionV2.LinkSection>
  </>
);

export default Section;
