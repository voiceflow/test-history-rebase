import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { BodyContainer, Container, TitleContainer } from './components';

interface CardProps {
  color: string;
  title: React.ReactElement;
  body: React.ReactElement;
  handleClose: () => void;
}

const Card: React.FC<CardProps> = ({ color, handleClose, title, body }) => {
  return (
    <Container>
      <TitleContainer color={color}>
        {title}
        <SvgIcon icon="close" size={14} onClick={handleClose} color="white" clickable />
      </TitleContainer>
      <BodyContainer>{body}</BodyContainer>
    </Container>
  );
};

export default Card;
