import React from 'react';

import Button, { ButtonVariant } from '@/components/Button';
import { PublishContext } from '@/pages/Skill/contexts';

import { ButtonContainer, ButtonLink, Description, StageContainer } from '../shared';

const WaitVendorsStage: React.FC = () => {
  const { cancel } = React.useContext(PublishContext)!;

  return (
    <StageContainer>
      <img src="/Support.svg" alt="" />

      <Description>Looks like you don't have a developer account, create one to get started!</Description>

      <ButtonContainer>
        <ButtonLink href="https://developer.amazon.com/login.html" onClick={cancel}>
          <Button variant={ButtonVariant.PRIMARY}>Developer Sign Up</Button>
        </ButtonLink>
      </ButtonContainer>
    </StageContainer>
  );
};

export default WaitVendorsStage;
