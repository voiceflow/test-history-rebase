import { toast, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import JobInterface from '@/components/JobInterface';
import { PublishVersionModalData } from '@/components/PublishVersionModal';
import { ModalType } from '@/constants';
import * as ProjectV2 from '@/ducks/projectV2';
import { useModals, useSelector, useTrackingEvents } from '@/hooks';
import { useJob, useSimulatedProgress } from '@/hooks/job';
import PublishButton from '@/pages/Project/components/Header/components/CanvasHeader/components/Upload/components/PublishButton';

import { useSMSStageContent } from './stages';

const SMS: React.FC = () => {
  const publishNewVersionModal = useModals<PublishVersionModalData>(ModalType.PUBLISH_VERSION_MODAL);

  const context = useJob(client.platform.sms.publish);
  const { job, active } = context;

  const [trackingEvents] = useTrackingEvents();

  const projectPlatformData = useSelector(ProjectV2.active.platformDataSelector);

  const onConfirm = usePersistFunction((versionName?: string) => {
    // modal awaits confirm before closing , start() takes a long time
    (async () => {
      try {
        trackingEvents.trackActiveProjectPublishAttempt();

        await context?.start({ versionName });
      } catch (err) {
        toast.error(`Updating live version failed: ${err}`);
      }
    })();
  });

  const onPublish = usePersistFunction(() => {
    if (projectPlatformData.messagingServiceID) {
      publishNewVersionModal.open({
        message: 'Publish this version to production and use it on Twilio SMS.',
        onConfirm,
      });
    } else {
      onConfirm();
    }
  });

  const Content = useSMSStageContent(job?.stage.type);

  const progress = useSimulatedProgress(job);

  return (
    <JobInterface Content={Content} context={context} progress={progress}>
      <PublishButton loading={active} progress={progress} onClick={onPublish} />
    </JobInterface>
  );
};

export default SMS;
