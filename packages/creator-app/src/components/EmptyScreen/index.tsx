import { Button, ButtonVariant, Link } from '@voiceflow/ui';
import React from 'react';

import { createGraphic } from '@/assets';
import { PROTOTYPING } from '@/config/documentation';

import { BodyTextContainer, ButtonContainer, Container, ContentContainer, Logo, LogoContainer, TitleLabel } from './components';

interface EmptyScreenProps {
  id?: string;
  title: string;
  body: string;
  buttonText: string;
  onClick: VoidFunction;
}

const EmptyScreen: React.FC<EmptyScreenProps> = ({ id, title, onClick, body, buttonText }) => {
  return (
    <Container>
      <ContentContainer>
        <LogoContainer>
          <Logo src={createGraphic} alt="skill-icon" width="80" height="80" />
        </LogoContainer>
        <TitleLabel>{title}</TitleLabel>
        <BodyTextContainer>
          {body} <Link href={PROTOTYPING}>Learn more</Link>
        </BodyTextContainer>
        <ButtonContainer>
          <Button id={id} onClick={() => onClick()} variant={ButtonVariant.PRIMARY}>
            {buttonText}
          </Button>
        </ButtonContainer>
      </ContentContainer>
    </Container>
  );
};

export default EmptyScreen;
