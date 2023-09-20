import { Box, Button, ButtonVariant, useLocalStorageState, usePersistFunction } from '@voiceflow/ui';
import { toast } from '@voiceflow/ui-next';
import React from 'react';

import { linkGraphic } from '@/assets';
import { UploadedStage } from '@/components/PlatformUploadPopup/components';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useDispatch, useSelector, useTrackingEvents } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { NLPTrainJob } from '@/models';
import { StageComponentProps } from '@/platforms/types';

import { createWidgetSessionKey } from '../utils';

const ConnectStage: React.FC<StageComponentProps<NLPTrainJob.ConfirmStage>> = ({ start, cancel }) => {
  const publishNewVersionModal = ModalsV2.useModal(ModalsV2.Publish.NewVersion);

  const projectID = useSelector(Session.activeProjectIDSelector);

  const goToConsole = useDispatch(Router.goToActivePlatformPublish);

  const [trackingEvents] = useTrackingEvents();

  const [firstTime, setFirstTime] = useLocalStorageState<boolean>(createWidgetSessionKey(projectID!), true);

  const openVersionModal = usePersistFunction(async () => {
    setFirstTime(false);
    cancel();

    try {
      const { versionName } = await publishNewVersionModal.open({
        message: 'Publish this version to production and use it on WhatsApp Business Messaging.',
      });

      try {
        trackingEvents.trackActiveProjectPublishAttempt();

        await start({ versionName });
      } catch (err) {
        toast.error(`Updating live version failed: ${err}`);
      }
    } catch {
      // canceled
    }
  });

  React.useEffect(() => {
    if (!firstTime) openVersionModal();
  }, []);

  // do not show popup if user has already connected to whatsapp
  if (!firstTime) {
    return null;
  }

  return (
    <UploadedStage
      title="Connect to WhatsApp"
      description="Connect your assistant to your WhatsApp Business account"
      imageProps={{ src: linkGraphic, height: 67 }}
    >
      <Button squareRadius fullWidth onClick={goToConsole}>
        Connect to WhatsApp
      </Button>
      <Box mt={8} />
      <Button squareRadius fullWidth variant={ButtonVariant.QUATERNARY} onClick={openVersionModal}>
        I've Already Done This
      </Button>
    </UploadedStage>
  );
};

export default ConnectStage;
