import { toast, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import JobInterface from '@/components/JobInterface';
import { PublishVersionModalData } from '@/components/PublishVersionModal';
import { ModalType } from '@/constants';
import { PublishContext } from '@/contexts';
import { useModals, useTrackingEvents } from '@/hooks';
import { useSimulatedProgress } from '@/hooks/job';
import PublishButton from '@/pages/Project/components/Header/components/CanvasHeader/components/Upload/components/PublishButton';

import { useWhatsAppStageContent } from './stages';

const WhatsApp: React.FC = () => {
  const publishNewVersionModal = useModals<PublishVersionModalData>(ModalType.PUBLISH_VERSION_MODAL);
  const publishContext = React.useContext(PublishContext)!;
  const { job, active } = publishContext;

  const [trackingEvents] = useTrackingEvents();

  const onConfirm = usePersistFunction((versionName: string) => {
    // modal awaits confirm before closing , start() takes a long time
    (async () => {
      try {
        trackingEvents.trackActiveProjectPublishAttempt();

        await publishContext?.start({ versionName });
      } catch (err) {
        toast.error(`Updating live version failed: ${err}`);
      }
    })();
  });

  const onPublish = usePersistFunction(() =>
    publishNewVersionModal.open({
      message: 'Publish this version to production and use it on WhatsApp Business Messaging.',
      onConfirm,
    })
  );

  const Content = useWhatsAppStageContent(job?.stage.type);

  const progress = useSimulatedProgress(job);

  return (
    <JobInterface Content={Content} context={publishContext} progress={progress}>
      <PublishButton loading={active} progress={progress} onClick={onPublish} />
    </JobInterface>
  );
};

export default WhatsApp;
