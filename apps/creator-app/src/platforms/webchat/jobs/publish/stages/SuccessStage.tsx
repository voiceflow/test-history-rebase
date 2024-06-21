import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import { UploadedStage } from '@/components/PlatformUploadPopup/components';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import { useFeature } from '@/hooks/feature.hook';
import { useSyncProjectLiveVersion } from '@/hooks/project';
import { useDispatch } from '@/hooks/realtime';
import { useLocalStorageState } from '@/hooks/storage.hook';
import { NLPTrainJob } from '@/models';
import { StageComponentProps } from '@/platforms/types';

const getWidgetSessionKey = (projectID: string) => `widget_publish_${projectID}`;

const SuccessStage: React.FC<StageComponentProps<NLPTrainJob.SuccessStage>> = ({ cancel }) => {
  useSyncProjectLiveVersion();

  const projectID = useSelector(Session.activeProjectIDSelector);
  const hideExports = useFeature(Realtime.FeatureFlag.HIDE_EXPORTS);

  const [firstTime, setFirstTime] = useLocalStorageState<boolean>(getWidgetSessionKey(projectID!), true);

  const goToConsole = useDispatch(Router.goToActivePlatformPublish);

  return (
    <UploadedStage description="A new version of your agent has been successfully published">
      {hideExports ? null : (
        <>
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
        </>
      )}
    </UploadedStage>
  );
};

export default SuccessStage;
