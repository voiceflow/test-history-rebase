import { Box, Button, ButtonVariant, Link } from '@voiceflow/ui';
import React from 'react';

import { supportGraphicSmall } from '@/assets';
import { Description } from '@/components/PlatformUploadPopup/components';
import { AlexaPublishJob } from '@/models';
import { StageComponentProps } from '@/platforms/types';

const WaitVendorsStage: React.FC<StageComponentProps<AlexaPublishJob.WaitVendorsStage>> = ({ cancel }) => (
  <Box.FlexCenter p={22} width={254} flexDirection="column" textAlign="center">
    <img src={supportGraphicSmall} alt="" />

    <Description>Looks like you don't have a developer account, create one to get started!</Description>

    <Link href="https://developer.amazon.com/login.html" onClick={cancel}>
      <Button variant={ButtonVariant.PRIMARY}>Developer Sign Up</Button>
    </Link>
  </Box.FlexCenter>
);

export default WaitVendorsStage;
