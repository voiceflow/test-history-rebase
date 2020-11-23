import React from 'react';

import { FeatureFlag } from '@/config/features';
import { ModalType } from '@/constants';
import { AlexaStageType } from '@/constants/platforms';
import * as Account from '@/ducks/account';
import { connect } from '@/hocs';
import { useFeature, useModals, useToggle, useTrackingEvents } from '@/hooks';
import { Alexa } from '@/pages/Publish/Upload';
import { PublishContext } from '@/pages/Skill/contexts';
import { useCanvasMode } from '@/pages/Skill/hooks';
import { ConnectedProps } from '@/types';
import { isNotify, isReady, isRunning } from '@/utils/job';

import { ConnectButton, LoadingButton, SuccessButton, UploadButton } from '../ActionButtons';
import UploadPopup from '../UploadPopup';
import Button from './Button';

const AlexaUploadButton: React.FC<AlexaUploadButtonConnectedProps> = ({ amazon, syncSelectedVendor }) => {
  const headerRedesign = useFeature(FeatureFlag.HEADER_REDESIGN);

  const isCanvasMode = useCanvasMode();

  const { job, cancel, publish, updateCurrentStage } = React.useContext(PublishContext)!;

  const [opened, onToggle] = useToggle(false);
  const { open: openLoginModal, close: closeLoginModal, isOpened: loginModalOpen } = useModals(ModalType.CONNECT);
  const [trackingEvents] = useTrackingEvents();

  const needsLogin = !amazon;

  const toggleLoginModal = () => {
    if (!!opened && job?.stage.type === AlexaStageType.WAIT_ACCOUNT && headerRedesign.isEnabled && !loginModalOpen) {
      openLoginModal({ stage: job?.stage.type, updateCurrentStage });
    } else {
      closeLoginModal();
    }
  };

  const onClose = React.useCallback(async () => {
    await cancel();
    onToggle(false);
  }, [cancel]);

  const onClick = () => {
    trackingEvents.trackActiveProjectPublishAttempt();
    if (isReady(job)) {
      publish();
    }
    onToggle(true);

    toggleLoginModal();
  };

  React.useEffect(() => {
    if (!opened && isNotify(job) && job?.stage.type !== AlexaStageType.WAIT_ACCOUNT) {
      onToggle(true);
    }

    toggleLoginModal();

    if (job?.stage.type === AlexaStageType.SUCCESS) {
      trackingEvents.trackActiveProjectPublishSuccess();
    }
  }, [opened, job?.status, job?.stage.type]);

  React.useEffect(() => {
    syncSelectedVendor();
  }, []);

  const AlexaButton = () => {
    if (needsLogin) {
      return <ConnectButton onClick={onClick} />;
    }
    switch (job?.stage.type) {
      case AlexaStageType.WAIT_ACCOUNT:
      case AlexaStageType.WAIT_VENDORS:
        return <ConnectButton onClick={onClick} />;
      case AlexaStageType.IDLE:
      case AlexaStageType.PROGRESS:
        return <LoadingButton tooltipOpen={job?.stage.type === AlexaStageType.PROGRESS} progress={job.stage.data.progress as number} />;
      case AlexaStageType.SUCCESS:
        return <SuccessButton />;
      case AlexaStageType.WAIT_INVOCATION_NAME:
      default:
        return <UploadButton onClick={onClick} isJobActive={isRunning(job)} />;
    }
  };

  const noPopup = headerRedesign.isEnabled && (job?.stage.type === AlexaStageType.PROGRESS || job?.stage.type === AlexaStageType.WAIT_ACCOUNT);
  return (
    <>
      {headerRedesign.isEnabled && isCanvasMode ? <AlexaButton /> : <Button onClick={onClick} isActive={isRunning(job)} />}
      {headerRedesign.isEnabled ? (
        <UploadPopup open={opened && !noPopup} onClose={onClose} jobStage={job?.stage.type}>
          {!noPopup && <Alexa />}
        </UploadPopup>
      ) : (
        <UploadPopup open={opened && !noPopup} onClose={onClose}>
          {!noPopup && <Alexa />}
        </UploadPopup>
      )}
    </>
  );
};

const mapStateToProps = {
  amazon: Account.amazonAccountSelector,
};

const mapDispatchToProps = {
  syncSelectedVendor: Account.syncSelectedVendor,
};

type AlexaUploadButtonConnectedProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(AlexaUploadButton);
