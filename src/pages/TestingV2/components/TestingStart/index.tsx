import React from 'react';

import Button from '@/components/Button';

import { Container } from './components';

export type TestingStartProps = {
  start: React.MouseEventHandler<HTMLButtonElement>;
};

const TestingStart: React.FC<TestingStartProps> = ({ start }) => (
  <Container>
    <img src="/Testing.svg" alt="user" width="80" />

    <div>Start test to see the dialog transcription</div>

    <Button icon="forward" onClick={start}>
      Start Test
    </Button>
  </Container>
);

export default TestingStart;
