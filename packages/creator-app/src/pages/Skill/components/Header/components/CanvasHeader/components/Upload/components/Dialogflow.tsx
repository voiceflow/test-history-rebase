import { Portal } from '@voiceflow/ui';
import React from 'react';

import { DialogflowStageType } from '@/constants/platforms';
import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { Dialogflow } from '@/pages/Publish/Upload';
import { ProgressStage } from '@/pages/Publish/Upload/components';
import { useDialogflowPublish } from '@/pages/Skill/hooks';

import Button, { ButtonVariant } from './Button';
import Popup from './Popup';

const JOB_STARTED_STAGES = [DialogflowStageType.IDLE, DialogflowStageType.PROGRESS, DialogflowStageType.SUCCESS];

const DialogflowPublish: React.FC = () => {
  const { job, noPopup, onCancel, onPublish, needsLogin, popupOpened, multiProjects, setMultiProjects, successfullyPublished } =
    useDialogflowPublish();

  const hotkeyDisabled = successfullyPublished || (!!job && JOB_STARTED_STAGES.includes(job?.stage.type));

  useHotKeys(Hotkey.UPLOAD_PROJECT, onPublish, { disable: hotkeyDisabled, preventDefault: true }, [onPublish]);

  const isSelectProjectStage = job?.stage.type === DialogflowStageType.WAIT_PROJECT;

  const button = React.useMemo(() => {
    if (needsLogin) {
      return <Button onClick={onPublish} variant={ButtonVariant.CONNECT} />;
    }

    if (successfullyPublished) {
      return <Button variant={ButtonVariant.SUCCESS} />;
    }

    switch (job?.stage.type) {
      case DialogflowStageType.WAIT_ACCOUNT:
        return <Button onClick={onPublish} variant={ButtonVariant.CONNECT} />;
      case DialogflowStageType.IDLE:
        return <Button variant={ButtonVariant.LOADING} progress={0} />;
      case DialogflowStageType.PROGRESS:
        return <Button variant={ButtonVariant.LOADING} progress={job.stage.data.progress} />;
      case DialogflowStageType.SUCCESS:
        return <Button variant={ButtonVariant.SUCCESS} />;
      default:
        return <Button onClick={onPublish} variant={ButtonVariant.UPLOAD} />;
    }
  }, [job, needsLogin, onPublish, successfullyPublished]);

  return (
    <>
      {button}

      <Portal>
        {job?.stage.type === DialogflowStageType.PROGRESS && <ProgressStage progress={job.stage.data.progress} />}

        <Popup open={popupOpened && (isSelectProjectStage || !noPopup)} onClose={onCancel} jobStage={job?.stage.type} multiSelect={multiProjects}>
          {(isSelectProjectStage || !noPopup) && <Dialogflow setMultiProjects={setMultiProjects} />}
        </Popup>
      </Portal>
    </>
  );
};

export default DialogflowPublish;
