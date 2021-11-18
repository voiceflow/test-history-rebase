import { Input } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import { useLinkedState } from '@/hooks';
import { withTargetValue } from '@/utils/dom';

interface StartLabelSectionProps {
  label: string;
  onChangeLabel: (label: string) => void;
}

const StartLabelSection: React.FC<StartLabelSectionProps> = ({ label, onChangeLabel }) => {
  const [localLabel, setLocalLabel] = useLinkedState(label);

  return (
    <Section header="Start Label" variant={SectionVariant.SUBSECTION} dividers={false} customContentStyling={{ paddingBottom: '20px' }}>
      <Input
        value={localLabel}
        onBlur={() => (localLabel ? onChangeLabel(localLabel) : setLocalLabel(label))}
        onChange={withTargetValue(setLocalLabel)}
        placeholder="Enter a Label"
      />
    </Section>
  );
};

export default StartLabelSection;
