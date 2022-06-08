import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

const ParametersSection: React.FC = () => {
  return (
    <SectionV2.ActionCollapseSection title="Parameters" action={<SectionV2.AddButton />} collapsed>
      Parameters content
    </SectionV2.ActionCollapseSection>
  );
};

export default ParametersSection;
