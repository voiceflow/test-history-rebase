import React from 'react';

import SvgIcon, { Icon } from '@/components/SvgIcon';

import { Container, IconContainer, InnerContainer, Label } from './components';

type ActionButtonProps = {
  shouldRender: boolean;
  icon: Icon;
  label: string;
  onClick: () => void;
};

const ActionButton: React.FC<ActionButtonProps> = ({ shouldRender, icon, label, onClick }) => (
  <Container>
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
