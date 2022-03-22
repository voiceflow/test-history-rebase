import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';

import { ChannelSelect } from '../Select';

interface ChannelSectionProps {
  channelValue: VoiceflowConstants.PlatformType | VoiceflowConstants.ProjectType | undefined;
  onChannelSelect: (value: VoiceflowConstants.PlatformType | VoiceflowConstants.ProjectType) => void;
}

const ChannelSection: React.FC<ChannelSectionProps> = ({ channelValue, onChannelSelect }) => {
  return (
    <Section header="Channel" variant={SectionVariant.TERTIARY}>
      <ChannelSelect value={channelValue} onSelect={onChannelSelect} />
    </Section>
  );
};

export default ChannelSection;
