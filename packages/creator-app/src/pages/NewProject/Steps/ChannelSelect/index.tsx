import { BoxFlexCenter, SvgIcon, useSetup } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { PROJECT_SECTIONS } from '../constants';
import { Container, Section } from './components';

interface ChannelSelectProps {
  onSelect: (option: { platform: VoiceflowConstants.PlatformType; projectType: VoiceflowConstants.ProjectType } | null) => void;
  isLoading: boolean;
}

const ChannelSelect: React.FC<ChannelSelectProps> = ({ onSelect, isLoading }) => {
  // When the user clicks back on the following step, reset platform
  useSetup(() => onSelect(null));

  return (
    <Container>
      {PROJECT_SECTIONS.map(({ name, platforms }, index) => (
        <Section key={index} name={name} platforms={platforms} onSelect={(option) => !isLoading && onSelect(option)} />
      ))}

      <BoxFlexCenter mt={32}>{isLoading && <SvgIcon icon="publishSpin" color="#92a3b3" size={36} spin />}</BoxFlexCenter>
    </Container>
  );
};

export default ChannelSelect;
