import { toast, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import JobInterface from '@/components/JobInterface';
import { PublishContextValue } from '@/contexts/PublishContext';
import * as ProjectV2 from '@/ducks/projectV2';
import { useSelector, useTrackingEvents } from '@/hooks';
import { useJob, useSimulatedProgress } from '@/hooks/job';
import * as ModalsV2 from '@/ModalsV2';
import { SMSPublishJob } from '@/models';
import PublishButton from '@/pages/Project/components/Upload/components/PublishButton';

import { useSMSStageContent } from './stages';

const SMS: React.FC = () => {
  const publishNewVersionModal = ModalsV2.useModal(ModalsV2.Publish.NewVersion);

  const context = useJob(client.platform.sms.publish) as PublishContextValue<SMSPublishJob.AnyJob>;
  const { job, active } = context;

  const [trackingEvents] = useTrackingEvents();

  const projectPlatformData = useSelector(ProjectV2.active.platformDataSelector);

  const onPublish = usePersistFunction(async () => {
    let versionName = '';

    if (projectPlatformData.messagingServiceID) {
      try {
        ({ versionName } = await publishNewVersionModal.open({
          message: 'Publish this version to production and use it on Twilio SMS.',
        }));
      } catch {
        // canceled
        return;
      }
    }

    try {
      trackingEvents.trackActiveProjectPublishAttempt();

      await context?.start({ versionName });
    } catch (err) {
      toast.error(`Updating live version failed: ${err}`);
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
