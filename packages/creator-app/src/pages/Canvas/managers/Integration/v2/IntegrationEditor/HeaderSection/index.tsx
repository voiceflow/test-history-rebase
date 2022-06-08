import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

const HeaderSection: React.FC = () => {
  return (
    <SectionV2.ActionCollapseSection title="Header" action={<SectionV2.AddButton />} collapsed>
      Header content
    </SectionV2.ActionCollapseSection>
  );
};

export default HeaderSection;
