import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';

import { ChannelSectionErrorMessage } from '../../constants';
import { ChannelSelect } from '../Select';
import { SectionErrorMessage } from './components';

interface ChannelSectionProps {
  channelValue: VoiceflowConstants.PlatformType | VoiceflowConstants.ProjectType | undefined;
  onChannelSelect: (value: VoiceflowConstants.PlatformType | VoiceflowConstants.ProjectType) => void;
  channelError: boolean;
}

const ChannelSection: React.FC<ChannelSectionProps> = ({ channelValue, onChannelSelect, channelError }) => {
  return (
    <Section
      header="Channel"
      variant={SectionVariant.FORM}
      dividers={false}
      customHeaderStyling={{ paddingTop: '24px' }}
      customContentStyling={{ paddingBottom: '0px' }}
    >
      <ChannelSelect value={channelValue} onSelect={onChannelSelect} error={channelError} />
      {channelError && <SectionErrorMessage>{ChannelSectionErrorMessage}</SectionErrorMessage>}
    </Section>
  );
};

export default ChannelSection;
