import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

const CaptureResponseSection: React.FC = () => {
  return (
    <SectionV2.ActionCollapseSection title="Capture response" action={<SectionV2.AddButton />} collapsed>
      Capture response content
    </SectionV2.ActionCollapseSection>
  );
};

export default CaptureResponseSection;
