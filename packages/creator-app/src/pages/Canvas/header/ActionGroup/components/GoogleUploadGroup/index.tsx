import React from 'react';

import { GoogleStageType } from '@/constants/platforms';
import { Google } from '@/pages/Publish/Upload';
import { useCanvasMode, useGooglePublish } from '@/pages/Skill/hooks';
import { isRunning } from '@/utils/job';

import { ConnectButton, LoadingButton, SuccessButton, UploadButton } from '../ActionButtons';
import UploadPopup from '../UploadPopup';
import Button from './Button';

const GoogleUploadButton: React.FC = () => {
  const isCanvasMode = useCanvasMode();

  const { job, noPopup, onCancel, onPublish, needsLogin, popupOpened, multiProjects, setMultiProjects, successfullyPublished } = useGooglePublish();

  const stageType = job?.stage.type;
  const isSelectProjectStage = stageType === GoogleStageType.WAIT_PROJECT;

  const googleButton = React.useMemo(() => {
    if (!isCanvasMode) {
      return null;
    }

    if (needsLogin) {
      return <ConnectButton onClick={onPublish} />;
    }

    if (successfullyPublished) {
      return <SuccessButton />;
    }

    if (popupOpened && isSelectProjectStage) {
      return <LoadingButton spin={false} active />;
    }

    switch (stageType) {
      case GoogleStageType.WAIT_ACCOUNT:
      case GoogleStageType.WAIT_PROJECT:
        return <ConnectButton onClick={onPublish} />;
      case GoogleStageType.IDLE:
      case GoogleStageType.PROGRESS:
        return <LoadingButton openTooltip={stageType === GoogleStageType.PROGRESS} />;
      case GoogleStageType.SUCCESS:
        return <SuccessButton />;
      case GoogleStageType.WAIT_INVOCATION_NAME:
      default:
        return <UploadButton onClick={onPublish} isJobActive={isRunning(job)} />;
    }
  }, [isCanvasMode, stageType, needsLogin, successfullyPublished, onPublish, isSelectProjectStage]);

  return (
    <>
      {isCanvasMode ? googleButton : <Button onClick={onPublish} isActive={isRunning(job)} />}

      <UploadPopup open={popupOpened && (isSelectProjectStage || !noPopup)} onClose={onCancel} jobStage={stageType} multiSelect={multiProjects}>
        {(isSelectProjectStage || !noPopup) && <Google setMultiProjects={setMultiProjects} />}
      </UploadPopup>
    </>
  );
};

export default GoogleUploadButton;
