import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { getChannelMeta } from '../../constants';
import Card from '../Card';
import { Container, Content, Label } from './styles';

interface SectionProps {
  name: string;
  onSelect: (option: { platform: VoiceflowConstants.PlatformType; projectType: VoiceflowConstants.ProjectType }) => void;
  platforms: { platform: VoiceflowConstants.PlatformType; projectType: VoiceflowConstants.ProjectType }[];
}

const Section: React.FC<SectionProps> = ({ name, platforms, onSelect }) => {
  return (
    <Container>
      <Label>{name}</Label>

      <Content>
        {platforms.map(({ platform, projectType }, index) => (
          <Card {...getChannelMeta(platform, projectType)} key={index} onClick={() => onSelect({ platform, projectType })} />
        ))}
      </Content>
    </Container>
  );
};
export default Section;
