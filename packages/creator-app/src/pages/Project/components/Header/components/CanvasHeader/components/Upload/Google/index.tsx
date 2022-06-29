import { Portal } from '@voiceflow/ui';
import React, { useCallback } from 'react';

import { PublishVersionModalData } from '@/components/PublishVersionModal';
import { FeatureFlag } from '@/config/features';
import { ModalType } from '@/constants';
import { GoogleStageType } from '@/constants/platforms';
import { useFeature, useHotKeys, useModals } from '@/hooks';
import { Hotkey } from '@/keymap';
import { useGooglePublish } from '@/pages/Project/hooks';
import { Google } from '@/platforms';

import Popup from '../components/Popup';
import ProgressStage from '../components/ProgressStage';
import { usePatchLiveVersion } from '../hooks';
import GoogleUploadButton from './components/GoogleUploadButton';

const JOB_STARTED_STAGES = new Set([GoogleStageType.IDLE, GoogleStageType.PROGRESS, GoogleStageType.SUCCESS]);

const GooglePublish: React.FC = () => {
  const {
    job,
    noPopup,
    onCancel,
    onPublish: publishToGoogle,
    needsLogin,
    popupOpened,
    multiProjects,
    setMultiProjects,
    successfullyPublished,
  } = useGooglePublish();

  const publishNewVersionModal = useModals<PublishVersionModalData>(ModalType.PUBLISH_VERSION_MODAL);

  const canUseGeneralPublish = useFeature(FeatureFlag.PRODUCTION_VERSION_MANAGEMENT);

  usePatchLiveVersion(successfullyPublished);

  const onPublish = useCallback(() => {
    if (canUseGeneralPublish.isEnabled) {
      publishNewVersionModal.open({ onConfirm: publishToGoogle });
    } else {
      publishToGoogle('');
    }
  }, []);

  const hotkeyDisabled = successfullyPublished || (!!job && JOB_STARTED_STAGES.has(job?.stage.type));

  useHotKeys(Hotkey.UPLOAD_PROJECT, onPublish, { disable: hotkeyDisabled, preventDefault: true }, [onPublish]);

  const isSelectProjectStage = job?.stage.type === GoogleStageType.WAIT_PROJECT;
  const isUploadPopupOpen = popupOpened && (isSelectProjectStage || !noPopup);
  const shouldRenderPopupContent = isSelectProjectStage || !noPopup;

  return (
    <>
      <GoogleUploadButton needsLogin={needsLogin} googlePublishJob={job} onPublish={onPublish} successfullyPublished={successfullyPublished} />

      <Portal>
        <ProgressStage job={job} inProgressStage={GoogleStageType.PROGRESS} />

        <Popup open={isUploadPopupOpen} onClose={onCancel} jobStage={job?.stage.type} multiSelect={multiProjects}>
          {shouldRenderPopupContent && <Google.Components.PlatformUploadPopup setMultiProjects={setMultiProjects} />}
        </Popup>
      </Portal>
    </>
  );
};

export default GooglePublish;
