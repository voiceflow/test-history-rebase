import { Box, SvgIcon, useSetup } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { Section } from './components';
import { PROJECT_SECTIONS } from './constants';
import { Container } from './styles';

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

      <Box.FlexCenter mt={32}>{isLoading && <SvgIcon icon="arrowSpin" color="#92a3b3" size={36} spin />}</Box.FlexCenter>
    </Container>
  );
};

export default ChannelSelect;
