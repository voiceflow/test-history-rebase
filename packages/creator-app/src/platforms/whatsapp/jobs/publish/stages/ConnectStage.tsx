import { Box, Button, ButtonVariant, useLocalStorageState } from '@voiceflow/ui';
import React from 'react';

import { linkGraphic } from '@/assets';
import { UploadedStage } from '@/components/PlatformUploadPopup/components';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useDispatch, useSelector, useSyncProjectLiveVersion } from '@/hooks';
import { NLPTrainJob } from '@/models';
import { StageComponentProps } from '@/platforms/types';

import { createWidgetSessionKey } from '../utils';

const ConnectStage: React.FC<StageComponentProps<NLPTrainJob.ConfirmStage>> = ({ restart }) => {
  useSyncProjectLiveVersion();

  const projectID = useSelector(Session.activeProjectIDSelector);
  const [, setFirstTime] = useLocalStorageState<boolean>(createWidgetSessionKey(projectID!), true);

  const goToConsole = useDispatch(Router.goToActivePlatformPublish);

  return (
    <UploadedStage
      title="Connect to WhatsApp"
      description="Connect your assistant to your WhatsApp Business account"
      imageProps={{
        src: linkGraphic,
        height: 67,
      }}
    >
      <Button squareRadius fullWidth onClick={goToConsole}>
        Connect to WhatsApp
      </Button>
      <Box mt={8} />
      <Button
        squareRadius
        fullWidth
        variant={ButtonVariant.QUATERNARY}
        onClick={() => {
          setFirstTime(false);
          restart();
        }}
      >
        I've Already Done This
      </Button>
    </UploadedStage>
  );
};

export default ConnectStage;
