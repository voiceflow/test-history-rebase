import { Portal } from '@voiceflow/ui';
import React from 'react';

import { AlexaStageType } from '@/constants/platforms';
import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { useAlexaPublish } from '@/pages/Project/hooks';
import { Alexa } from '@/platforms';

import Popup from '../components/Popup';
import AlexaProgressState from './components/AlexaProgressState';
import AlexaUploadButton from './components/AlexaUploadButton';

const JOB_STARTED_STAGES = [AlexaStageType.IDLE, AlexaStageType.PROGRESS, AlexaStageType.SUCCESS];

const AlexaPublish: React.FC = () => {
  const { job, noPopup, onCancel, onPublish, needsLogin, popupOpened, successfullyPublished } = useAlexaPublish();

  const hotkeyDisabled = successfullyPublished || (!!job && JOB_STARTED_STAGES.includes(job?.stage.type));

  useHotKeys(Hotkey.UPLOAD_PROJECT, onPublish, { disable: hotkeyDisabled, preventDefault: true }, [onPublish]);

  const isUploadPopupOpen = popupOpened && !noPopup;
  const shouldRenderPopupContent = !noPopup;

  return (
    <>
      <AlexaUploadButton
        needsLogin={needsLogin}
        alexaPublishJob={job}
        onPublish={onPublish}
        popupOpened={popupOpened}
        successfullyPublished={successfullyPublished}
      />

      <Portal>
        <AlexaProgressState alexaJob={job} />

        <Popup open={isUploadPopupOpen} onClose={onCancel} jobStage={job?.stage.type}>
          {shouldRenderPopupContent && <Alexa.Components.PlatformUploadPopup />}
        </Popup>
      </Portal>
    </>
  );
};

export default AlexaPublish;
