import { toast, usePersistFunction } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import client from '@/client';
import JobInterface from '@/components/JobInterface';
import { PublishVersionModalData } from '@/components/PublishVersionModal';
import { ModalType } from '@/constants';
import { VersionTag } from '@/constants/platforms';
import { TrainingContext, TrainingProvider } from '@/contexts';
import * as Project from '@/ducks/project';
import { activeProjectIDSelector } from '@/ducks/session';
import { useDispatch, useModals, useTrackingEvents } from '@/hooks';
import { getProgress } from '@/utils/job';

import GeneralUploadButton from './components/GeneralUploadButton';
import { useNLPTrainingStageContent } from './stages';

const GeneralPublish: React.FC = () => {
  const publishNewVersionModal = useModals<PublishVersionModalData>(ModalType.PUBLISH_VERSION_MODAL);

  const activeProjectID = useSelector(activeProjectIDSelector)!;

  const updateProjectLiveVersion = useDispatch(Project.updateProjectLiveVersion);

  const trainingContext = React.useContext(TrainingContext)!;
  const { job, active } = trainingContext;

  const [trackingEvents] = useTrackingEvents();

  const onConfirm = usePersistFunction((versionName: string) => {
    // modal awaits confirm before closing , start() takes a long time
    (async () => {
      try {
        trackingEvents.trackActiveProjectPublishAttempt();

        await trainingContext?.start({ versionName });

        const { liveVersion } = await client.api.project.get(activeProjectID!, ['liveVersion']);
        updateProjectLiveVersion(activeProjectID, liveVersion!);
      } catch (err) {
        toast.error(`Updating live version failed: ${err}`);
      }
    })();
  });

  const onPublish = usePersistFunction(() =>
    publishNewVersionModal.open({
      onConfirm,
    })
  );

  const Content = useNLPTrainingStageContent(job?.stage.type);

  return (
    <JobInterface Content={Content} context={trainingContext}>
      <GeneralUploadButton loading={active} progress={getProgress(job)} onClick={onPublish} />
    </JobInterface>
  );
};

const General: React.FC = () => (
  <TrainingProvider tag={VersionTag.PRODUCTION}>
    <GeneralPublish />
  </TrainingProvider>
);

export default General;
