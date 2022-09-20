import { BoxFlex, SectionV2, TutorialInfoIcon } from '@voiceflow/ui';
import React from 'react';

import { styled } from '@/hocs';

import InfoTooltip from './InfoTooltip';

interface SectionProps {
  label: string;
  onClick: VoidFunction;
}

const TutorialWrapper = styled.div`
  margin-left: 10px;
  margin-top: 1px;
`;

const Section: React.FC<SectionProps> = ({ label, onClick }) => (
  <>
    <SectionV2.Divider />

    <SectionV2.LinkSection onClick={onClick}>
      <BoxFlex>
        <SectionV2.Title>{label}</SectionV2.Title>

        <TutorialWrapper>
          <TutorialInfoIcon>
            <InfoTooltip label={label} />
          </TutorialInfoIcon>
        </TutorialWrapper>
      </BoxFlex>
    </SectionV2.LinkSection>
  </>
);

export default Section;
