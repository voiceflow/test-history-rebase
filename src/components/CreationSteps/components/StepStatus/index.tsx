import React from 'react';

import { Container, ProgressLine, Title } from './components';

type StepStatusProps = {
  title: any;
  numberOfSteps: number;
  stepStack: any[];
};

const StepStatus: React.FC<StepStatusProps> = ({ title, numberOfSteps, stepStack }) => {
  return (
    <Container>
      <Title>{title}</Title>
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
};

export default StepStatus;
