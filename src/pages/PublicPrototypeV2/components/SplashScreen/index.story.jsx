import { boolean, number, text } from '@storybook/addon-knobs';
import React from 'react';

import Box from '@/components/Box';
import Flex from '@/components/Flex';

import SplashScreen from '.';
import MobileVoiceInstruction from './components/MobileVoiceInstruction';

export default {
  title: 'PublicPrototype/SplashScreen',
  component: SplashScreen,
};

const getProps = () => ({
  logoSize: number('logoSize', 48),
  centerAlign: boolean('centerAlign', false),
  colorScheme: text('colorScheme', '#539af5'),
  onStartButton: () => alert('Started'),
  withStartButton: boolean('withStartButton', true),
});

export const withDialog = () => (
  <Flex style={{ width: '100%', height: '800px' }}>
    <Box width={500} height="100%">
      <SplashScreen projectName="Sample Bot" {...getProps()} />
    </Box>
    <Box width={700} height="100%" padding={50} flex="center" style={{ 'border-left': '1px solid #dfe3ed', backgroundColor: 'white' }}>
      Dialog Section
    </Box>
  </Flex>
);

export const mobile = () => (
  <Flex style={{ width: '100%', height: '900px' }}>
    <Box width={500} height="100%">
      <SplashScreen projectName="Sample Bot" centerAlign />
    </Box>
  </Flex>
);

export const mobileInstruction = () => (
  <Flex style={{ width: '100%', height: '900px' }}>
    <Box width={500} height="100%">
      <MobileVoiceInstruction />
    </Box>
  </Flex>
);
