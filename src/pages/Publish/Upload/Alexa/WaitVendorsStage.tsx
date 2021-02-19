import React from 'react';

import Button, { ButtonVariant } from '@/components/Button';

import { ButtonContainer, ButtonLink, Description, StageContainer } from '../components';

type WaitVendorsStageProps = {
  cancel: () => void;
};

const WaitVendorsStage: React.FC<WaitVendorsStageProps> = ({ cancel }) => (
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

export default WaitVendorsStage;
