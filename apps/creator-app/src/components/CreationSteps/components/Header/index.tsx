import React from 'react';

import { ClassName } from '@/styles/constants';

import { ActionButton, Container, Content, StepStatus } from './components';

interface CreationHeaderProps extends React.PropsWithChildren {
  hasBackButton: boolean;
  stepBack: () => void;
  canCancel: boolean;
  onCancel: () => void;
  hasSkipButton: boolean;
  onSkipClick: () => void;
  title: any;
  numberOfSteps: number;
  stepStack: any[];
}

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
    <ActionButton className={ClassName.CREATE_PROJECT_LEFT_ACTION} shouldRender={hasBackButton} icon="back" onClick={stepBack} label="back" />
    <StepStatus title={title} numberOfSteps={numberOfSteps} stepStack={stepStack} />

    {!!children && <Content withOffset={!!canCancel || hasSkipButton}>{children}</Content>}

    {canCancel ? (
      <ActionButton className={ClassName.CREATE_PROJECT_RIGHT_ACTION} shouldRender icon="close" label="cancel" onClick={onCancel} />
    ) : (
      <ActionButton className={ClassName.CREATE_PROJECT_RIGHT_ACTION} shouldRender={hasSkipButton} icon="next" label="skip" onClick={onSkipClick} />
    )}
  </Container>
);

export default CreationHeader;
