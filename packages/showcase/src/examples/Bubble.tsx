import { Bubble, Flex } from '@voiceflow/ui';
import React from 'react';

import { createExample, createSection } from './utils';

const bubbleExample = createExample('scroll button', () => (
  <Flex column gap={16}>
    <Bubble direction="down" onClick={() => {}}>
      Scroll to botton
    </Bubble>
  </Flex>
));

export default createSection('Bubble', 'src/components/Bubble/index.tsx', [bubbleExample]);
