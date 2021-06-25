import React from 'react';

import { AlexaStageType } from '@/constants/platforms';
import { Alexa } from '@/pages/Publish/Upload';
import { useAlexaPublish, useCanvasMode } from '@/pages/Skill/hooks';
import { isRunning } from '@/utils/job';

import { ConnectButton, LoadingButton, SuccessButton, UploadButton } from '../ActionButtons';
import UploadPopup from '../UploadPopup';

const AlexaUploadButton: React.FC = () => {
  const isCanvasMode = useCanvasMode();

  const { job, noPopup, onCancel, onPublish, needsLogin, popupOpened, showSelectVendor, setVendorSelected, successfullyPublished } =
    useAlexaPublish();

  const stageType = job?.stage.type;
  const jobIsRunning = isRunning(job);

  const alexaButton = React.useMemo(() => {
    if (!isCanvasMode) {
      return null;
    }

    if (needsLogin) {
      return <ConnectButton onClick={onPublish} />;
    }

    if (successfullyPublished) {
      return <SuccessButton />;
    }

    if (popupOpened && showSelectVendor) {
      return <LoadingButton spin={false} active />;
    }

    switch (stageType) {
      case AlexaStageType.WAIT_ACCOUNT:
      case AlexaStageType.WAIT_VENDORS:
        return <ConnectButton onClick={onPublish} />;
      case AlexaStageType.IDLE:
      case AlexaStageType.PROGRESS:
        return <LoadingButton openTooltip={stageType === AlexaStageType.PROGRESS} />;
      case AlexaStageType.SUCCESS:
        return <SuccessButton />;
      case AlexaStageType.WAIT_INVOCATION_NAME:
      default:
        return <UploadButton onClick={onPublish} isJobActive={jobIsRunning} />;
    }
  }, [isCanvasMode, stageType, needsLogin, onPublish, successfullyPublished, popupOpened, showSelectVendor, jobIsRunning]);

  return (
    <>
      {alexaButton}

      <UploadPopup multiSelect={showSelectVendor} open={popupOpened && (showSelectVendor || !noPopup)} onClose={onCancel} jobStage={stageType}>
        {(showSelectVendor || !noPopup) && <Alexa showSelectVendor={showSelectVendor} setVendorSelected={setVendorSelected} />}
      </UploadPopup>
    </>
  );
};

export default AlexaUploadButton;
