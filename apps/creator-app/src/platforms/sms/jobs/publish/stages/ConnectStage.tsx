import { Button } from '@voiceflow/ui';
import React from 'react';

import { linkGraphic } from '@/assets';
import { UploadedStage } from '@/components/PlatformUploadPopup/components';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';
import type { StageComponentProps } from '@/platforms/types';

const ConnectStage: React.FC<StageComponentProps<any>> = () => {
  const goToConsole = useDispatch(Router.goToActivePlatformPublish);

  return (
    <UploadedStage
      title="Connect to Twilio SMS"
      description="Connect your agent to your Twilio Messaging account"
      imageProps={{ src: linkGraphic, height: 67 }}
    >
      <Button fullWidth onClick={goToConsole}>
        Connect to Twilio
      </Button>
    </UploadedStage>
  );
};

export default ConnectStage;
