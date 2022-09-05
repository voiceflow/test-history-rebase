import { Portal } from '@voiceflow/ui';
import React from 'react';

import { PublishVersionModalData } from '@/components/PublishVersionModal';
import { ModalType } from '@/constants';
import { DialogflowStageType } from '@/constants/platforms';
import { useHotKeys, useModals } from '@/hooks';
import { Hotkey } from '@/keymap';
import { useDialogflowPublish } from '@/pages/Project/hooks';
import { Dialogflow } from '@/platforms';

import Popup from '../components/Popup';
import ProgressStage from '../components/ProgressStage';
import { usePatchLiveVersion } from '../hooks';
import DialogflowUploadButton from './components/DialogflowUploadButton';

const JOB_STARTED_STAGES = new Set([DialogflowStageType.IDLE, DialogflowStageType.PROGRESS, DialogflowStageType.SUCCESS]);

const DialogflowPublish: React.FC = () => {
  const {
    job,
    noPopup,
    onCancel,
    onPublish: publishToDF,
    needsLogin,
    popupOpened,
    multiProjects,
    setMultiProjects,
    successfullyPublished,
    createNewAgent,
    createNewAgentModalOpened,
  } = useDialogflowPublish();

  const publishNewVersionModal = useModals<PublishVersionModalData>(ModalType.PUBLISH_VERSION_MODAL);

  usePatchLiveVersion(successfullyPublished);

  const onPublish = React.useCallback(() => {
    publishNewVersionModal.open({ onConfirm: publishToDF });
  }, []);

  const hotkeyDisabled = successfullyPublished || (!!job && JOB_STARTED_STAGES.has(job?.stage.type));

  useHotKeys(Hotkey.UPLOAD_PROJECT, onPublish, { disable: hotkeyDisabled, preventDefault: true }, [onPublish]);

  const isSelectProjectStage = job?.stage.type === DialogflowStageType.WAIT_PROJECT;
  const isUploadPopupOpen = popupOpened && (isSelectProjectStage || !noPopup) && !createNewAgentModalOpened;
  const shouldRenderPopupContent = isSelectProjectStage || !noPopup;

  return (
    <>
      <DialogflowUploadButton
        needsLogin={needsLogin}
        dialogflowPublishJob={job}
        onPublish={onPublish}
        successfullyPublished={successfullyPublished}
      />

      <Portal>
        <ProgressStage job={job} inProgressStage={DialogflowStageType.PROGRESS} />

        <Popup open={isUploadPopupOpen} onClose={onCancel} jobStage={job?.stage.type} multiSelect={multiProjects}>
          {shouldRenderPopupContent && (
            <Dialogflow.Components.PlatformUploadPopup setMultiProjects={setMultiProjects} createNewAgent={createNewAgent} />
          )}
        </Popup>
      </Portal>
    </>
  );
};

export default DialogflowPublish;
