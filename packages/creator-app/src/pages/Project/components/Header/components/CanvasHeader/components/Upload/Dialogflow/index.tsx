import { Portal } from '@voiceflow/ui';
import React from 'react';

import { DialogflowStageType } from '@/constants/platforms';
import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { useDialogflowPublish } from '@/pages/Project/hooks';
import { Dialogflow } from '@/platforms';

import Popup from '../components/Popup';
import DialogflowProgressStage from './components/DialogflowProgressStage';
import DialogflowUploadButton from './components/DialogflowUploadButton';

const JOB_STARTED_STAGES = new Set([DialogflowStageType.IDLE, DialogflowStageType.PROGRESS, DialogflowStageType.SUCCESS]);

const DialogflowPublish: React.FC = () => {
  const {
    job,
    noPopup,
    onCancel,
    onPublish,
    needsLogin,
    popupOpened,
    multiProjects,
    setMultiProjects,
    successfullyPublished,
    createNewAgent,
    createNewAgentModalOpened,
  } = useDialogflowPublish();

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
        <DialogflowProgressStage dialogflowPublishJob={job} />

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
