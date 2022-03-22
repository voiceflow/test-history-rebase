import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';

import { NLUSelect } from '../Select';

interface NLUSectionProps {
  nluValue: VoiceflowConstants.PlatformType | undefined;
  onNluSelect: (value: VoiceflowConstants.PlatformType) => void;
}

const NLUSection: React.FC<NLUSectionProps> = ({ nluValue, onNluSelect }) => {
  return (
    <Section header="NLU" variant={SectionVariant.TERTIARY}>
      <NLUSelect value={nluValue} onSelect={onNluSelect} />
    </Section>
  );
};

export default NLUSection;
