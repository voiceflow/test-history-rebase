import React from 'react';

import { ActionButton, Container, StepStatus } from './components';

type CreationHeaderProps = {
  hasBackButton: boolean;
  stepBack: () => void;
  canCancel: boolean;
  onCancel: () => void;
  hasSkipButton: boolean;
  onSkipClick: () => void;
  title: any;
  numberOfSteps: number;
  stepStack: any[];
};

const CreationHeader: React.FC<CreationHeaderProps> = ({
  hasBackButton,
  stepBack,
  canCancel,
  onCancel,
  hasSkipButton,
  onSkipClick,
  title,
  numberOfSteps,
  stepStack,
}) => (
  <Container>
    <ActionButton shouldRender={hasBackButton} icon="back" onClick={stepBack} label="back" />
    <StepStatus title={title} numberOfSteps={numberOfSteps} stepStack={stepStack} />
    {canCancel ? (
      <ActionButton shouldRender icon="close" label="cancel" onClick={onCancel} />
    ) : (
      <ActionButton shouldRender={hasSkipButton} icon="next" label="skip" onClick={onSkipClick} />
    )}
  </Container>
);

export default CreationHeader;
