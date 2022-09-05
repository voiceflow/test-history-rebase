import { Portal } from '@voiceflow/ui';
import React from 'react';

import { PublishVersionModalData } from '@/components/PublishVersionModal';
import { ModalType } from '@/constants';
import { AlexaStageType } from '@/constants/platforms';
import { useHotKeys, useModals } from '@/hooks';
import { Hotkey } from '@/keymap';
import { useAlexaPublish } from '@/pages/Project/hooks';
import { Alexa } from '@/platforms';

import Popup from '../components/Popup';
import ProgressStage from '../components/ProgressStage';
import AlexaUploadButton from './components/AlexaUploadButton';

const JOB_STARTED_STAGES = new Set([AlexaStageType.IDLE, AlexaStageType.PROGRESS, AlexaStageType.SUCCESS]);

const AlexaPublish: React.FC = () => {
  const { job, noPopup, onCancel, onPublish: publishToAlexa, needsLogin, popupOpened, successfullyPublished } = useAlexaPublish();

  const publishNewVersionModal = useModals<PublishVersionModalData>(ModalType.PUBLISH_VERSION_MODAL);

  const onPublish = React.useCallback(() => {
    publishNewVersionModal.open({ onConfirm: publishToAlexa });
  }, []);

  const hotkeyDisabled = successfullyPublished || (!!job && JOB_STARTED_STAGES.has(job?.stage.type));

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
        <ProgressStage job={job} inProgressStage={AlexaStageType.PROGRESS} />

        <Popup open={isUploadPopupOpen} onClose={onCancel} jobStage={job?.stage.type}>
          {shouldRenderPopupContent && <Alexa.Components.PlatformUploadPopup />}
        </Popup>
      </Portal>
    </>
  );
};

export default AlexaPublish;
