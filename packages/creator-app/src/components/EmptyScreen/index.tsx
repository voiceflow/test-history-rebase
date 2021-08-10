import { Button, ButtonVariant, FlexCenter } from '@voiceflow/ui';
import React from 'react';

import { createGraphic } from '@/assets';

import { BodyTextContainer, ButtonContainer, ContentContainer, Logo, LogoContainer, TitleLabel } from './components';

interface EmptyScreenProps {
  id?: string;
  title: string;
  body: string;
  buttonText: string;
  onClick: () => any;
}

const EmptyScreen: React.FC<EmptyScreenProps> = ({ id, title, onClick, body, buttonText }) => {
  return (
    <FlexCenter>
      <ContentContainer>
        <LogoContainer>
          <Logo src={createGraphic} alt="skill-icon" width="80" height="80" />
        </LogoContainer>
        <TitleLabel>{title}</TitleLabel>
        <BodyTextContainer>{body}</BodyTextContainer>
        <ButtonContainer>
          <Button id={id} onClick={onClick} variant={ButtonVariant.PRIMARY}>
            {buttonText}
          </Button>
        </ButtonContainer>
      </ContentContainer>
    </FlexCenter>
  );
};

export default EmptyScreen;
