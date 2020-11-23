import React from 'react';

import { FeatureFlag } from '@/config/features';
import { ModalType } from '@/constants';
import { GoogleStageType } from '@/constants/platforms';
import * as Account from '@/ducks/account';
import { connect } from '@/hocs';
import { useFeature, useModals, useToggle, useTrackingEvents } from '@/hooks';
import { Google } from '@/pages/Publish/Upload';
import WaitProjectStage from '@/pages/Publish/Upload/Google/WaitProjectStage';
import { PublishContext } from '@/pages/Skill/contexts';
import { useCanvasMode } from '@/pages/Skill/hooks';
import { ConnectedProps } from '@/types';
import { isNotify, isReady, isRunning } from '@/utils/job';

import { ConnectButton, LoadingButton, SuccessButton, UploadButton } from '../ActionButtons';
import UploadPopup from '../UploadPopup';
import Button from './Button';

const GoogleUploadButton: React.FC<GoogleUploadButtonConnectedProps> = ({ google, getGoogleAccount }) => {
  const headerRedesign = useFeature(FeatureFlag.HEADER_REDESIGN);

  const isCanvasMode = useCanvasMode();

  const { job, publish, updateCurrentStage, cancel } = React.useContext(PublishContext)!;

  const [opened, onToggle] = useToggle(false);
  const { open: openLoginModal, close: closeLoginModal, isOpened: loginModalOpen } = useModals(ModalType.CONNECT);
  const [trackingEvents] = useTrackingEvents();

  const needsLogin = !google;

  const toggleLoginModal = () => {
    if (!!opened && job?.stage.type === GoogleStageType.WAIT_ACCOUNT && headerRedesign.isEnabled && !loginModalOpen) {
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
    if (!opened && isNotify(job) && job?.stage.type !== GoogleStageType.WAIT_ACCOUNT) {
      onToggle(true);
    }

    toggleLoginModal();

    if (job?.stage.type === GoogleStageType.SUCCESS) {
      trackingEvents.trackActiveProjectPublishSuccess();
    }
  }, [opened, job?.status, job?.stage.type]);

  React.useEffect(() => {
    getGoogleAccount();
  }, []);

  const GoogleButton = () => {
    if (needsLogin) {
      return <ConnectButton onClick={onClick} />;
    }
    switch (job?.stage.type) {
      case GoogleStageType.WAIT_ACCOUNT:
      case GoogleStageType.WAIT_PROJECT:
        return <ConnectButton onClick={onClick} />;
      case GoogleStageType.IDLE:
      case GoogleStageType.PROGRESS:
        return <LoadingButton tooltipOpen={job?.stage.type === GoogleStageType.PROGRESS} progress={job.stage.data.progress as number} />;
      case GoogleStageType.SUCCESS:
        return <SuccessButton />;
      case GoogleStageType.WAIT_INVOCATION_NAME:
      default:
        return <UploadButton onClick={onClick} isJobActive={isRunning(job)} />;
    }
  };

  const noPopup = headerRedesign.isEnabled && (job?.stage.type === GoogleStageType.PROGRESS || job?.stage.type === GoogleStageType.WAIT_ACCOUNT);
  const popup = headerRedesign.isEnabled ? (
    <UploadPopup open={opened && !noPopup} onClose={onClose} jobStage={job?.stage.type}>
      {!noPopup && <Google />}
    </UploadPopup>
  ) : (
    <UploadPopup open={opened && !noPopup} onClose={onClose}>
      {!noPopup && <Google />}
    </UploadPopup>
  );
  return (
    <>
      {headerRedesign.isEnabled && isCanvasMode ? <GoogleButton /> : <Button onClick={onClick} isActive={isRunning(job)} />}
      {headerRedesign.isEnabled && job?.stage.type === GoogleStageType.WAIT_PROJECT ? (
        <WaitProjectStage open={opened && !noPopup} onClose={onClose} updateCurrentStage={updateCurrentStage} cancel={cancel} />
      ) : (
        popup
      )}
    </>
  );
};

const mapStateToProps = {
  google: Account.googleAccountSelector,
};

const mapDispatchToProps = {
  getGoogleAccount: Account.getGoogleAccount,
};

type GoogleUploadButtonConnectedProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(GoogleUploadButton);
