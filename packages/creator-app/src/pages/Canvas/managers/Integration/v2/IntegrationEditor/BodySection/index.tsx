import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

const BodySection: React.FC = () => {
  return (
    <SectionV2.ActionCollapseSection title="Body" action={<SectionV2.AddButton />} collapsed>
      Body content
    </SectionV2.ActionCollapseSection>
  );
};

export default BodySection;
