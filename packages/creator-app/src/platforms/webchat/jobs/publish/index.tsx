import { System, toast, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import JobInterface from '@/components/JobInterface';
import { WEBCHAT_LEARN_MORE } from '@/constants/platforms';
import { PublishContext } from '@/contexts/PublishContext';
import { useTrackingEvents } from '@/hooks';
import { useSimulatedProgress } from '@/hooks/job';
import * as ModalsV2 from '@/ModalsV2';
import PublishButton from '@/pages/Project/components/Header/components/CanvasHeader/components/Upload/components/PublishButton';

import { useWebchatStageContent } from './stages';

const Webchat: React.FC = () => {
  const publishNewVersionModal = ModalsV2.useModal(ModalsV2.Publish.NewVersion);

  const publishContext = React.useContext(PublishContext)!;
  const { job, active } = publishContext;

  const [trackingEvents] = useTrackingEvents();

  const onPublish = usePersistFunction(async () => {
    try {
      const { versionName } = await publishNewVersionModal.open({
        message: (
          <>
            Publish this version to production and use it with your <System.Link.Anchor href={WEBCHAT_LEARN_MORE}>Web Chat</System.Link.Anchor>.
          </>
        ),
      });

      try {
        trackingEvents.trackActiveProjectPublishAttempt();

        await publishContext?.start({ versionName });
      } catch (err) {
        toast.error(`Updating live version failed: ${err}`);
      }
    } catch {
      // canceled
    }
  });

  const Content = useWebchatStageContent(job?.stage.type);

  const progress = useSimulatedProgress(job);

  return (
    <JobInterface Content={Content} context={publishContext} progress={progress}>
      <PublishButton loading={active} progress={progress} onClick={onPublish} />
    </JobInterface>
  );
};

export default Webchat;
