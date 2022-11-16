import { Link, toast, usePersistFunction } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import client from '@/client';
import JobInterface from '@/components/JobInterface';
import { PublishVersionModalData } from '@/components/PublishVersionModal';
import { ModalType } from '@/constants';
import { VersionTag, WEBCHAT_LEARN_MORE } from '@/constants/platforms';
import { TrainingContext, TrainingProvider } from '@/contexts';
import * as Project from '@/ducks/project';
import { activeProjectIDSelector } from '@/ducks/session';
import { useDispatch, useModals, useTrackingEvents } from '@/hooks';
import { useSimulatedProgress } from '@/hooks/job';
import PublishButton from '@/pages/Project/components/Header/components/CanvasHeader/components/Upload/components/PublishButton';

import { useNLPTrainingStageContent } from './stages';

const WebchatPublish: React.FC = () => {
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
      message: (
        <>
          Publish this version to production and use it with your <Link href={WEBCHAT_LEARN_MORE}>Web Chat</Link>.
        </>
      ),
      onConfirm,
    })
  );

  const Content = useNLPTrainingStageContent(job?.stage.type);

  const progress = useSimulatedProgress(job);

  return (
    <JobInterface Content={Content} context={trainingContext} progress={progress}>
      <PublishButton loading={active} progress={progress} onClick={onPublish} />
    </JobInterface>
  );
};

const Webchat: React.FC = () => (
  <TrainingProvider tag={VersionTag.PRODUCTION}>
    <WebchatPublish />
  </TrainingProvider>
);

export default Webchat;
