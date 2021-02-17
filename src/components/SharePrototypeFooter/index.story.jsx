import { boolean } from '@storybook/addon-knobs';
import React from 'react';

import Flex from '@/components/Flex';
import ClickableText from '@/components/Text/components/ClickableText';
import { styled } from '@/hocs';

import Footer from '.';

const TextContainer = styled.div`
  color: #a8b6c3;
  font-weight: 500;
`;

const getProps = () => ({
  isMuted: boolean('isMuted', false),
  canRestart: boolean('canRestart', false),
});

export const standard = () => (
  <Flex style={{ width: '100%', height: '100%', position: 'absolute', 'flex-direction': 'column-reverse' }}>
    <Footer {...getProps()} goFullscreen={() => alert('Fullscreen!')} resetTest={() => alert('Reset Test!')}>
      <TextContainer>
        Hold <ClickableText>spacebar</ClickableText> to record
      </TextContainer>
    </Footer>
  </Flex>
);
