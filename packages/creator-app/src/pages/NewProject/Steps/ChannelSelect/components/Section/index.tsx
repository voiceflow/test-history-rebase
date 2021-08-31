import { PlatformType } from '@voiceflow/internal';
import React from 'react';

import { getChannelMeta } from '../../../constants';
import Card from '../Card';
import { Container, Content, Label } from './components';

interface SectionProps {
  name: string;
  onSelect: (platform: PlatformType) => void;
  platforms: PlatformType[];
}

const Section: React.FC<SectionProps> = ({ name, platforms, onSelect }) => {
  return (
    <Container>
      <Label>{name}</Label>

      <Content>
        {platforms.map((platform, index) => (
          <Card {...getChannelMeta(platform)} key={index} onClick={() => onSelect(platform)} />
        ))}
      </Content>
    </Container>
  );
};
export default Section;
