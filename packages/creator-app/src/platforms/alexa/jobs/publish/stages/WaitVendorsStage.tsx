import { Box, Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import { supportGraphicSmall } from '@/assets';
import { ButtonContainer, ButtonLink, Description } from '@/components/PlatformUploadPopup/components';
import { AlexaPublishJob } from '@/models';
import { StageComponentProps } from '@/platforms/types';

const WaitVendorsStage: React.FC<StageComponentProps<AlexaPublishJob.WaitVendorsStage>> = ({ cancel }) => (
  <Box p={22} textAlign="center" width={254}>
    <img src={supportGraphicSmall} alt="" />

    <Description>Looks like you don't have a developer account, create one to get started!</Description>

    <ButtonContainer>
      <ButtonLink href="https://developer.amazon.com/login.html" onClick={cancel}>
        <Button variant={ButtonVariant.PRIMARY}>Developer Sign Up</Button>
      </ButtonLink>
    </ButtonContainer>
  </Box>
);

export default WaitVendorsStage;
