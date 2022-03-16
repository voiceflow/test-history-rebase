import React from 'react';

import Section, { SectionVariant } from '@/components/Section';

import { NLUType } from '../../constants';
import { NLUSelect } from '../Select';

interface ChannelSectionProps {
  nluValue: NLUType | undefined;
  onNluSelect: (value: NLUType) => void;
}

const NLUSection: React.FC<ChannelSectionProps> = ({ nluValue, onNluSelect }) => {
  return (
    <Section header="NLU" variant={SectionVariant.TERTIARY}>
      <NLUSelect value={nluValue} onSelect={onNluSelect} />
    </Section>
  );
};

export default NLUSection;
