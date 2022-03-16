import React from 'react';

import Section, { SectionVariant } from '@/components/Section';

import { ChannelType } from '../../constants';
import { ChannelSelect } from '../Select';

interface ChannelSectionProps {
  channelValue: ChannelType | undefined;
  onChannelSelect: (value: ChannelType) => void;
}

const ChannelSection: React.FC<ChannelSectionProps> = ({ channelValue, onChannelSelect }) => {
  return (
    <Section header="Channel" variant={SectionVariant.TERTIARY}>
      <ChannelSelect value={channelValue} onSelect={onChannelSelect} />
    </Section>
  );
};

export default ChannelSection;
