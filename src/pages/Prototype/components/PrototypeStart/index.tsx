import React from 'react';

import Button from '@/components/Button';

import { Container } from './components';

export type PrototypeStartProps = {
  start: React.MouseEventHandler<HTMLButtonElement>;
};

const PrototypeStart: React.FC<PrototypeStartProps> = ({ start }) => (
  <Container>
    <img src="/Testing.svg" alt="user" width="80" />

    <div>Start test to see the dialog transcription</div>

    <Button icon="rocket" onClick={start}>
      Start Prototype
    </Button>
  </Container>
);

export default PrototypeStart;
