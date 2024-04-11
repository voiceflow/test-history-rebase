import { System, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import JobInterface from '@/components/JobInterface';
import { DIALOG_MANAGER_API } from '@/config/documentation';
import { PublishContext } from '@/contexts/PublishContext';
import * as Project from '@/ducks/projectV2';
import { activeProjectIDSelector } from '@/ducks/session';
import { useDispatch, useSelector, useTrackingEvents } from '@/hooks';
import { useSimulatedProgress } from '@/hooks/job';
import * as ModalsV2 from '@/ModalsV2';

import GeneralUploadButton from './components/GeneralUploadButton';
import { useNLPTrainingStageContent } from './stages';

const General: React.FC = () => {
  const publishNewVersionModal = ModalsV2.useModal(ModalsV2.Publish.NewVersion);

  const activeProjectID = useSelector(activeProjectIDSelector)!;

  const updateProjectLiveVersion = useDispatch(Project.updateProjectLiveVersion);

  const publishContext = React.useContext(PublishContext);
  const { job, active } = publishContext;

  const [trackingEvents] = useTrackingEvents();

  const onPublish = async () => {
    try {
      const { versionName } = await publishNewVersionModal.open({
        message: (
          <>
            Publish this version to production and use it with our{' '}
            <System.Link.Anchor href={DIALOG_MANAGER_API}>Dialog Manager API</System.Link.Anchor>.
          </>
        ),
      });

      try {
        trackingEvents.trackActiveProjectPublishAttempt();

        await publishContext?.start({ versionName });

        const { liveVersion } = await client.api.project.get(activeProjectID!, ['liveVersion']);

        updateProjectLiveVersion(activeProjectID, liveVersion!);
      } catch (err) {
        toast.error(`Updating live version failed: ${err}`);
      }
    } catch {
      // canceled
    }
  };

  const Content = useNLPTrainingStageContent(job?.stage.type);

  const progress = useSimulatedProgress(job);

  return (
    <JobInterface Content={Content} context={publishContext} progress={progress}>
      <GeneralUploadButton loading={active} progress={progress} onClick={onPublish} />
    </JobInterface>
  );
};

export default General;
