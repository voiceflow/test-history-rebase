import { Box, Cursor, CursorNametag, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { createExample, createSection } from './utils';

const users = [
  { name: 'Sørina', color: '#F86683', backgroundColor: '#FEF2F4' },
  { name: 'Alexander', color: '#5891FB', backgroundColor: '#EFF5FF' },
  { name: 'Mia', color: '#36B4D2', backgroundColor: '#ECF8FA' },
  { name: '奥巴马', color: '#36B4D2', backgroundColor: '#ECF8FA' },
  { name: 'Amélie', color: '#42B761', backgroundColor: '#EDF8F0' },
  { name: 'xxX__🔥360noscope420🔥__Xxx', color: '#E760D4', backgroundColor: '#FCEFFB' },
  { name: 'Luke Skywalker', color: '#26A69A', backgroundColor: '#EBF7F5' },
  { name: 'Обама, Барак', color: '#8DA2B5', backgroundColor: '#F2F5F7' },
  { name: '버락 오바마', color: '#D58B5F', backgroundColor: '#FAF2ED' },
  { name: 'باراک اوباما', color: '#697986', backgroundColor: '#EEF0F1' },
];

const examples = users.map((user, index) =>
  createExample(`example ${index + 1}`, () => {
    const [nameTagRef, setNameTagRef] = React.useState<HTMLDivElement | null>(null);

    return (
      <Box height={45} width={(nameTagRef?.clientWidth ?? 0) + 12} position="relative">
        <Cursor withTransition={false}>
          <SvgIcon icon="cursor" color={user.color} />
          <div style={{ position: 'relative' }}>
            <CursorNametag color={user.color} backgroundColor={user.backgroundColor} ref={(ref) => setNameTagRef(ref)}>
              {user.name}
            </CursorNametag>
          </div>
        </Cursor>
      </Box>
    );
  })
);

export default createSection('Cursor', 'src/components/Cursor/index.ts', examples);
