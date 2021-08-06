import { Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import { supportGraphicSmall } from '@/assets';

import { ButtonContainer, ButtonLink, Description, StageContainer } from '../components';

interface WaitVendorsStageProps {
  cancel: () => void;
}

const WaitVendorsStage: React.FC<WaitVendorsStageProps> = ({ cancel }) => (
  <StageContainer>
    <img src={supportGraphicSmall} alt="" />

    <Description>Looks like you don't have a developer account, create one to get started!</Description>

    <ButtonContainer>
      <ButtonLink href="https://developer.amazon.com/login.html" onClick={cancel}>
        <Button variant={ButtonVariant.PRIMARY}>Developer Sign Up</Button>
      </ButtonLink>
    </ButtonContainer>
  </StageContainer>
);

export default WaitVendorsStage;
