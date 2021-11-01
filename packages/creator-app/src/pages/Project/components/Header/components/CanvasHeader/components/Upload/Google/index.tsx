import { Portal } from '@voiceflow/ui';
import React from 'react';

import Google from '@/components/PlatformUploadPopup/Google';
import { GoogleStageType } from '@/constants/platforms';
import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { useGooglePublish } from '@/pages/Project/hooks';

import Popup from '../components/Popup';
import GoogleProgressStage from './components/GoogleProgressStage';
import GoogleUploadButton from './components/GoogleUploadButton';

const JOB_STARTED_STAGES = [GoogleStageType.IDLE, GoogleStageType.PROGRESS, GoogleStageType.SUCCESS];

const GooglePublish: React.FC = () => {
  const { job, noPopup, onCancel, onPublish, needsLogin, popupOpened, multiProjects, setMultiProjects, successfullyPublished } = useGooglePublish();

  const hotkeyDisabled = successfullyPublished || (!!job && JOB_STARTED_STAGES.includes(job?.stage.type));

  useHotKeys(Hotkey.UPLOAD_PROJECT, onPublish, { disable: hotkeyDisabled, preventDefault: true }, [onPublish]);

  const isSelectProjectStage = job?.stage.type === GoogleStageType.WAIT_PROJECT;
  const isUploadPopupOpen = popupOpened && (isSelectProjectStage || !noPopup);
  const shouldRenderPopupContent = isSelectProjectStage || !noPopup;

  return (
    <>
      <GoogleUploadButton needsLogin={needsLogin} googlePublishJob={job} onPublish={onPublish} successfullyPublished={successfullyPublished} />

      <Portal>
        <GoogleProgressStage googleJob={job} />

        <Popup open={isUploadPopupOpen} onClose={onCancel} jobStage={job?.stage.type} multiSelect={multiProjects}>
          {shouldRenderPopupContent && <Google setMultiProjects={setMultiProjects} />}
        </Popup>
      </Portal>
    </>
  );
};

export default GooglePublish;
