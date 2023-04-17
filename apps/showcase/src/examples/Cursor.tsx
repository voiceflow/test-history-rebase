import { Box, Cursor } from '@voiceflow/ui';
import React from 'react';

import { createExample, createSection } from './utils';

const users = [
  { name: 'Sørina', color: '#F86683' },
  { name: 'Alexander', color: '#5891FB' },
  { name: 'Mia', color: '#36B4D2' },
  { name: '奥巴马', color: '#36B4D2' },
  { name: 'Amélie', color: '#42B761' },
  { name: 'xxX__🔥360noscope420🔥__Xxx', color: '#E760D4' },
  { name: 'Luke Skywalker', color: '#26A69A' },
  { name: 'Обама, Барак', color: '#8DA2B5' },
  { name: '버락 오바마', color: '#D58B5F' },
  { name: 'باراک اوباما', color: '#697986' },
];

const examples = users.map((user, index) =>
  createExample(`example ${index + 1}`, () => {
    const [cursorRef, setCursorRef] = React.useState<HTMLDivElement | null>(null);

    return (
      <Box height={45} width={cursorRef?.scrollWidth || 45} position="relative">
        <Cursor withTransition={false} color={user.color} name={user.name} ref={(ref) => setCursorRef(ref)} />
      </Box>
    );
  })
);

export default createSection('Cursor', 'src/components/Cursor/index.ts', examples);
