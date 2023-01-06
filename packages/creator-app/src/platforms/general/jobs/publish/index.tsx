import { Link, toast, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import JobInterface from '@/components/JobInterface';
import { PublishVersionModalData } from '@/components/PublishVersionModal';
import { ModalType } from '@/constants';
import { PublishContext } from '@/contexts/PublishContext';
import * as Project from '@/ducks/project';
import * as Router from '@/ducks/router';
import { activeProjectIDSelector } from '@/ducks/session';
import { useDispatch, useModals, useSelector, useTrackingEvents } from '@/hooks';
import { useSimulatedProgress } from '@/hooks/job';

import GeneralUploadButton from './components/GeneralUploadButton';
import { useNLPTrainingStageContent } from './stages';

const General: React.OldFC = () => {
  const publishNewVersionModal = useModals<PublishVersionModalData>(ModalType.PUBLISH_VERSION_MODAL);

  const activeProjectID = useSelector(activeProjectIDSelector)!;

  const updateProjectLiveVersion = useDispatch(Project.updateProjectLiveVersion);

  const publishContext = React.useContext(PublishContext)!;
  const { job, active } = publishContext;

  const [trackingEvents] = useTrackingEvents();

  const onConfirm = usePersistFunction((versionName: string) => {
    // modal awaits confirm before closing , start() takes a long time
    (async () => {
      try {
        trackingEvents.trackActiveProjectPublishAttempt();

        await publishContext?.start({ versionName });

        const { liveVersion } = await client.api.project.get(activeProjectID!, ['liveVersion']);
        updateProjectLiveVersion(activeProjectID, liveVersion!);
      } catch (err) {
        toast.error(`Updating live version failed: ${err}`);
      }
    })();
  });

  const goToCurrentPublish = useDispatch(Router.goToActivePlatformPublish);

  const onLinkClick = () => {
    publishNewVersionModal.close();
    goToCurrentPublish();
  };

  const onPublish = usePersistFunction(() =>
    publishNewVersionModal.open({
      message: (
        <>
          Publish this version to production and use it with our <Link onClick={onLinkClick}>Dialog Manager API</Link>.
        </>
      ),
      onConfirm,
    })
  );

  const Content = useNLPTrainingStageContent(job?.stage.type);

  const progress = useSimulatedProgress(job);

  return (
    <JobInterface Content={Content} context={publishContext} progress={progress}>
      <GeneralUploadButton loading={active} progress={progress} onClick={onPublish} />
    </JobInterface>
  );
};

export default General;
