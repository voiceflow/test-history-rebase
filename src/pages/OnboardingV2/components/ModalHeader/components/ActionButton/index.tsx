import React from 'react';

import SvgIcon, { Icon } from '@/components/SvgIcon';

import Container from './components/Container';
import IconContainer from './components/IconContainer';
import InnerContainer from './components/InnerContainer';
import Label from './components/Label';

type ActionButtonProps = {
  shouldRender: boolean;
  icon: Icon;
  label: string;
  onClick: () => void;
};

const ActionButton: React.FC<ActionButtonProps> = ({ shouldRender, icon, label, onClick }) => {
  return (
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
};

export default ActionButton;
