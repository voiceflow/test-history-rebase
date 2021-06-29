import { Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';
import { Link } from 'react-router-dom';

import { createGraphic } from '@/assets';

import Container from './components';

interface EmptyScreenProps {
  title: string;
  body: string;
  buttonText: string;
  link: string;
  onClick?: () => void;
}

const EmptyScreen: React.FC<EmptyScreenProps> = ({ title, body, buttonText, link }) => {
  return (
    <Container className="h-100 d-flex justify-content-center">
      <div className="align-self-center text-center">
        <div className="text-center">
          <img src={createGraphic} alt="skill-icon" width="80" height="80" className="mb-3" />
        </div>
        <label className="dark text-center mb-2">{title}</label>
        <div className="text-muted mb-4">{body}</div>
        <Link to={link} className="no-underline super-center">
          <Button variant={ButtonVariant.PRIMARY}>{buttonText}</Button>
        </Link>
      </div>
    </Container>
  );
};

export default EmptyScreen;
