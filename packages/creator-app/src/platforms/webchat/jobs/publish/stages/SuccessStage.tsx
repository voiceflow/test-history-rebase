import { Box, Button, ButtonVariant, useLocalStorageState } from '@voiceflow/ui';
import React from 'react';

import { UploadedStage } from '@/components/PlatformUploadPopup/components';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useSyncProjectLiveVersion } from '@/hooks/project';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { NLPTrainJob } from '@/models';
import { StageComponentProps } from '@/platforms/types';

const getWidgetSessionKey = (projectID: string) => `widget_publish_${projectID}`;

const SuccessStage: React.FC<StageComponentProps<NLPTrainJob.SuccessStage>> = ({ cancel }) => {
  useSyncProjectLiveVersion();

  const projectID = useSelector(Session.activeProjectIDSelector);

  const [firstTime, setFirstTime] = useLocalStorageState<boolean>(getWidgetSessionKey(projectID!), true);

  const goToConsole = useDispatch(Router.goToActivePlatformPublish);

  return (
    <UploadedStage description="A new version of your assistant has been successfully published">
      {firstTime ? (
        <>
          <Button squareRadius fullWidth onClick={goToConsole}>
            Embed Widget
          </Button>
          <Box mt={8} />
          <Button
            squareRadius
            fullWidth
            variant={ButtonVariant.QUATERNARY}
            onClick={() => {
              setFirstTime(false);
              cancel();
            }}
          >
            I've Already Done This
          </Button>
        </>
      ) : (
        <Button squareRadius fullWidth variant={ButtonVariant.QUATERNARY} onClick={goToConsole}>
          Customize Widget
        </Button>
      )}
    </UploadedStage>
  );
};

export default SuccessStage;
