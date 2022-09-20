import { Portal, toast } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import client from '@/client';
import PageProgressBar from '@/components/PageProgressBar';
import { PublishVersionModalData } from '@/components/PublishVersionModal';
import { ModalType } from '@/constants';
import { NLPTrainStageType, VersionTag } from '@/constants/platforms';
import * as Project from '@/ducks/project';
import { activeProjectIDSelector } from '@/ducks/session';
import { useDispatch, useModals, useTrackingEvents } from '@/hooks';
import { NLPContext, NLPProvider } from '@/pages/Project/contexts/NLPContext';

import GeneralUploadButton from './components/GeneralUploadButton';

const GeneralPublish: React.FC = () => {
  const publishVersionModal = useModals<PublishVersionModalData>(ModalType.PUBLISH_VERSION_MODAL);

  const activeProjectID = useSelector(activeProjectIDSelector)!;

  const updateProjectLiveVersion = useDispatch(Project.updateProjectLiveVersion);

  const nlpContext = React.useContext(NLPContext)!;
  const isTraining = !!nlpContext && (nlpContext.publishing || !!nlpContext.job);

  const stageType = nlpContext.job?.stage.type;
  const progress = nlpContext.job?.stage.type === NLPTrainStageType.PROGRESS ? nlpContext.job.stage.data.progress : 0;

  const [trackingEvents] = useTrackingEvents();

  const updateLiveVersion = React.useCallback(
    async (versionName: string) => {
      try {
        trackingEvents.trackActiveProjectPublishAttempt();

        publishVersionModal.close();
        await nlpContext?.publish({ versionName });

        const { liveVersion } = await client.api.project.get(activeProjectID!, ['liveVersion']);
        updateProjectLiveVersion(activeProjectID, liveVersion!);
      } catch (err) {
        toast.error(`Updating live version failed: ${err}`);
      }
    },
    [activeProjectID]
  );

  const onClick = React.useCallback(() => {
    publishVersionModal.open({ onConfirm: updateLiveVersion });
  }, [publishVersionModal, updateLiveVersion]);

  React.useEffect(() => {
    if (stageType === NLPTrainStageType.SUCCESS) {
      trackingEvents.trackActiveProjectPublishSuccess();
    }
  }, [stageType]);

  return (
    <>
      <Portal>
        <PageProgressBar progress={progress} />
      </Portal>
      <GeneralUploadButton isTraining={isTraining} onClick={onClick} progress={progress} />
    </>
  );
};

const UpdateLiveContainer: React.FC = () => {
  // Called when we finished updating the live version and publishing to production
  const onFinished = React.useCallback(() => {
    toast.success('Version successfully published.');
  }, []);

  return (
    <NLPProvider tag={VersionTag.PRODUCTION} onFinished={onFinished}>
      <GeneralPublish />
    </NLPProvider>
  );
};

export default UpdateLiveContainer;
