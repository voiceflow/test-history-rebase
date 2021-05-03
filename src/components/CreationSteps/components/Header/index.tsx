import React from 'react';

import { ActionButton, Container, Content, StepStatus } from './components';

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
  children,
}) => (
  <Container>
    <ActionButton shouldRender={hasBackButton} icon="back" onClick={stepBack} label="back" />
    <StepStatus title={title} numberOfSteps={numberOfSteps} stepStack={stepStack} />

    {!!children && <Content withOffset={!!canCancel || hasSkipButton}>{children}</Content>}

    {canCancel ? (
      <ActionButton shouldRender icon="close" label="cancel" onClick={onCancel} />
    ) : (
      <ActionButton shouldRender={hasSkipButton} icon="next" label="skip" onClick={onSkipClick} />
    )}
  </Container>
);

export default CreationHeader;
