import { Portal } from '@voiceflow/ui';
import React from 'react';

import Dialogflow from '@/components/PlatformUploadPopup/Dialogflow';
import { DialogflowStageType } from '@/constants/platforms';
import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { useDialogflowPublish } from '@/pages/Skill/hooks';

import Popup from '../components/Popup';
import DialogflowProgressStage from './components/DialogflowProgressStage';
import DialogflowUploadButton from './components/DialogflowUploadButton';

const JOB_STARTED_STAGES = [DialogflowStageType.IDLE, DialogflowStageType.PROGRESS, DialogflowStageType.SUCCESS];

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

  const hotkeyDisabled = successfullyPublished || (!!job && JOB_STARTED_STAGES.includes(job?.stage.type));

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
          {shouldRenderPopupContent && <Dialogflow setMultiProjects={setMultiProjects} createNewAgent={createNewAgent} />}
        </Popup>
      </Portal>
    </>
  );
};

export default DialogflowPublish;
