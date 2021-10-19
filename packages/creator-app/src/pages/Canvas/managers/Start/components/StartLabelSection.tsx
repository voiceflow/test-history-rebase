import { Input } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import { useLinkedState } from '@/hooks';
import { getTargetValue } from '@/utils/dom';

interface StartLabelSectionProps {
  label: string;
  onChangeLabel: (label: string) => void;
}

const StartLabelSection: React.FC<StartLabelSectionProps> = ({ label, onChangeLabel }) => {
  const [localLabel, setLocalLabel] = useLinkedState(label);

  return (
    <Section header="Start Label" variant={SectionVariant.QUATERNARY} isDividerNested customContentStyling={{ paddingBottom: '20px' }}>
      <Input
        value={localLabel}
        onBlur={() => (localLabel ? onChangeLabel(localLabel) : setLocalLabel(label))}
        onChange={getTargetValue(setLocalLabel)}
        placeholder="Enter a Label"
      />
    </Section>
  );
};

export default StartLabelSection;
