import { Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import { createGraphic } from '@/assets';

import Container from './components';

interface EmptyScreenProps {
  id?: string;
  title: string;
  body: string;
  buttonText: string;
  onClick: () => any;
}

const EmptyScreen: React.FC<EmptyScreenProps> = ({ id, title, onClick, body, buttonText }) => {
  return (
    <Container className="h-100 d-flex justify-content-center">
      <div className="align-self-center text-center">
        <div className="text-center">
          <img src={createGraphic} alt="skill-icon" width="80" height="80" className="mb-3" />
        </div>
        <label className="dark text-center mb-2">{title}</label>
        <div className="text-muted mb-4">{body}</div>
        <div className="no-underline super-center">
          <Button id={id} onClick={onClick} variant={ButtonVariant.PRIMARY}>
            {buttonText}
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default EmptyScreen;
