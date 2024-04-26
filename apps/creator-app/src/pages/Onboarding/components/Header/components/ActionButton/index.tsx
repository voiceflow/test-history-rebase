import type { SvgIconTypes } from '@voiceflow/ui';
import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { Container, IconContainer, InnerContainer, Label } from './components';

interface ActionButtonProps {
  icon: SvgIconTypes.Icon;
  label: string;
  onClick: () => void;
  className?: string;
  shouldRender: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ className, shouldRender, icon, label, onClick }) => (
  <Container className={className}>
    {shouldRender && (
      <InnerContainer onClick={onClick}>
        <IconContainer>
          <SvgIcon icon={icon} color="#becedc" />
        </IconContainer>

        <Label>{label}</Label>
      </InnerContainer>
    )}
  </Container>
);

export default ActionButton;
