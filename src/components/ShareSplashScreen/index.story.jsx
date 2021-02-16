import { boolean, number, text } from '@storybook/addon-knobs';
import React from 'react';

import Box from '@/components/Box';
import Flex from '@/components/Flex';

import ShareSplashScreen from '.';
import MobileInstructionScreen from './components/MobileInstructionScreen';

const getProps = () => ({
  centerAlign: boolean('centerAlign', false),
  withStartButton: boolean('withStartButton', true),
  logoSize: number('logoSize', 48),
  colorScheme: text('colorScheme', '#539af5'),
  onStartButton: () => {
    alert('Started');
  },
});

export const withDialog = () => (
  <Flex style={{ width: '100%', height: '800px' }}>
    <Box width={500} height="100%">
      <ShareSplashScreen projectName="Sample Bot" {...getProps()} />
    </Box>
    <Box width={700} height="100%" padding={50} flex="center" style={{ 'border-left': '1px solid #dfe3ed', backgroundColor: 'white' }}>
      Dialog Section
    </Box>
  </Flex>
);

export const mobile = () => (
  <Flex style={{ width: '100%', height: '900px' }}>
    <Box width={500} height="100%">
      <ShareSplashScreen projectName="Sample Bot" centerAlign />
    </Box>
  </Flex>
);

export const mobileInstruction = () => (
  <Flex style={{ width: '100%', height: '900px' }}>
    <Box width={500} height="100%">
      <MobileInstructionScreen />
    </Box>
  </Flex>
);
