import { Portal } from '@voiceflow/ui';
import React from 'react';

import Alexa from '@/components/PlatformUploadPopup/Alexa';
import { AlexaStageType } from '@/constants/platforms';
import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { useAlexaPublish } from '@/pages/Project/hooks';

import Popup from '../components/Popup';
import AlexaProgressState from './components/AlexaProgressState';
import AlexaUploadButton from './components/AlexaUploadButton';

const JOB_STARTED_STAGES = [AlexaStageType.IDLE, AlexaStageType.PROGRESS, AlexaStageType.SUCCESS];

const AlexaPublish: React.FC = () => {
  const { job, noPopup, onCancel, onPublish, needsLogin, popupOpened, vendorSelected, showSelectVendor, setVendorSelected, successfullyPublished } =
    useAlexaPublish();

  const hotkeyDisabled = successfullyPublished || (popupOpened && showSelectVendor) || (!!job && JOB_STARTED_STAGES.includes(job?.stage.type));

  useHotKeys(Hotkey.UPLOAD_PROJECT, onPublish, { disable: hotkeyDisabled, preventDefault: true }, [onPublish]);

  const isUploadPopupOpen = popupOpened && (!vendorSelected || !noPopup);
  const shouldRenderPopupContent = showSelectVendor || !noPopup;

  return (
    <>
      <AlexaUploadButton
        needsLogin={needsLogin}
        alexaPublishJob={job}
        onPublish={onPublish}
        popupOpened={popupOpened}
        showSelectVendor={showSelectVendor}
        successfullyPublished={successfullyPublished}
      />

      <Portal>
        <AlexaProgressState alexaJob={job} />

        <Popup multiSelect={showSelectVendor} open={isUploadPopupOpen} onClose={onCancel} jobStage={job?.stage.type}>
          {shouldRenderPopupContent && <Alexa showSelectVendor={showSelectVendor} setVendorSelected={setVendorSelected} />}
        </Popup>
      </Portal>
    </>
  );
};

export default AlexaPublish;
