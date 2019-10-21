import React from 'react';

import BlockRenderer from './components/BlockRenderer';
import Container from './components/DesignerContainer';
import DragLayer from './components/DragLayer';

const Designer = () => (
  <Container>
    <DragLayer />
    <div style={{ display: 'flex', width: '100%', marginTop: '-400px', justifyContent: 'center' }}>
      <BlockRenderer />
    </div>
  </Container>
);

export default Designer;
