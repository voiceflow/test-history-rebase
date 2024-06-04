import React from 'react';

import { Identifier } from '@/styles/constants';

import * as S from './styles';

interface StepStatusProps {
  title: any;
  numberOfSteps: number;
  stepStack: any[];
}

const StepStatus: React.FC<StepStatusProps> = ({ title, numberOfSteps, stepStack }) => (
  <S.Container>
    <S.Title id={Identifier.PROJECT_CREATION_STEP_TITLE}>{title}</S.Title>
    {numberOfSteps > 1 && (
      <>
        {stepStack.map((_, index) => (
          <S.ProgressLine active key={`filled-${index}`} />
        ))}

        {Array.from({ length: numberOfSteps - stepStack.length }, (_, index) => (
          <S.ProgressLine key={`empty-${index}`} />
        ))}
      </>
    )}
  </S.Container>
);

export default StepStatus;
