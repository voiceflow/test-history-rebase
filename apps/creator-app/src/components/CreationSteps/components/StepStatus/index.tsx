import React from 'react';

import { Identifier } from '@/styles/constants';

import { Container, ProgressLine, Title } from './components';

interface StepStatusProps {
  title: any;
  numberOfSteps: number;
  stepStack: any[];
}

const StepStatus: React.FC<StepStatusProps> = ({ title, numberOfSteps, stepStack }) => (
  <Container>
    <Title id={Identifier.PROJECT_CREATION_STEP_TITLE}>{title}</Title>
    {numberOfSteps > 1 && (
      <>
        {stepStack.map((_, index) => (
          <ProgressLine active key={`filled-${index}`} />
        ))}

        {Array.from({ length: numberOfSteps - stepStack.length }, (_, index) => (
          <ProgressLine key={`empty-${index}`} />
        ))}
      </>
    )}
  </Container>
);

export default StepStatus;
