import React from 'react';

import { toast } from '@/components/Toast';
import { FeatureFlag } from '@/config/features';
import { DiagramState, ModalType } from '@/constants';
import { AlexaStageType } from '@/constants/platforms';
import * as Account from '@/ducks/account';
import * as Creator from '@/ducks/creator';
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

const AlexaUploadButton: React.FC<AlexaUploadButtonConnectedProps> = ({ amazon, syncSelectedVendor, diagramState }) => {
  const headerRedesign = useFeature(FeatureFlag.HEADER_REDESIGN);

  const isCanvasMode = useCanvasMode();

  const { job, cancel, publish, updateCurrentStage } = React.useContext(PublishContext)!;

  const [persistSuccess, setPersistSuccess] = React.useState(false);

  React.useEffect(() => {
    if (job?.stage.type === AlexaStageType.SUCCESS) {
      setPersistSuccess(true);
    }
  }, [job?.stage.type]);

  React.useEffect(() => {
    if (diagramState === DiagramState.SAVING) {
      setPersistSuccess(false);
    }
  }, [diagramState]);

  const [opened, onToggle] = useToggle(false);
  const [waitingForCancel, setWaitingForCancel] = React.useState(false);
  const { open: openLoginModal, close: closeLoginModal, isOpened: loginModalOpen } = useModals(ModalType.CONNECT);
  const [trackingEvents] = useTrackingEvents();
  const [invalidInvName, setInvalidInvName] = React.useState(false);

  const needsLogin = !amazon;

  const toggleLoginModal = () => {
    if (!headerRedesign.isEnabled) return;
    if (!needsLogin) {
      if (loginModalOpen) {
        closeLoginModal();
      } else {
        return;
      }
    }
    if (job?.stage.type === AlexaStageType.IDLE) {
      openLoginModal({ stage: job?.stage.type, updateCurrentStage });
    } else if (job?.stage.type === AlexaStageType.WAIT_ACCOUNT) {
      if (loginModalOpen) {
        closeLoginModal();
        openLoginModal({ stage: job?.stage.type, updateCurrentStage });
      } else if (opened) {
        openLoginModal({ stage: job?.stage.type, updateCurrentStage });
      }
    } else {
      closeLoginModal();
    }
  };

  const onClose = React.useCallback(async () => {
    onToggle(false);
    setWaitingForCancel(true);
    await cancel();
    setWaitingForCancel(false);
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
    if (job == null && invalidInvName) {
      setInvalidInvName(false);
      onToggle(false);
      return;
    }

    if (!opened && isNotify(job) && job?.stage.type !== AlexaStageType.WAIT_ACCOUNT && !waitingForCancel) {
      onToggle(true);
    }

    toggleLoginModal();

    if (job?.stage.type === AlexaStageType.SUCCESS) {
      trackingEvents.trackActiveProjectPublishSuccess();
    }

    if (opened && job?.stage.type === AlexaStageType.WAIT_INVOCATION_NAME) {
      cancel();
      setInvalidInvName(true);
      toast.error('Invalid invocation name. Please update your invocation name in settings and try again.');
    }
  }, [opened, job?.stage.type, needsLogin]);

  React.useEffect(() => {
    syncSelectedVendor();
  }, []);

  const AlexaButton = React.useCallback(() => {
    if (needsLogin) {
      return <ConnectButton onClick={onClick} />;
    }
    if (persistSuccess) {
      return <SuccessButton />;
    }
    switch (job?.stage.type) {
      case AlexaStageType.WAIT_ACCOUNT:
      case AlexaStageType.WAIT_VENDORS:
        return <ConnectButton onClick={onClick} />;
      case AlexaStageType.IDLE:
      case AlexaStageType.PROGRESS:
        return <LoadingButton openTooltip={job?.stage.type === AlexaStageType.PROGRESS} />;
      case AlexaStageType.SUCCESS:
        return <SuccessButton />;
      case AlexaStageType.WAIT_INVOCATION_NAME:
      default:
        return <UploadButton onClick={onClick} isJobActive={isRunning(job)} />;
    }
  }, [job?.stage.type, needsLogin, persistSuccess, opened, loginModalOpen]);

  const noPopup =
    job?.stage.type === AlexaStageType.WAIT_INVOCATION_NAME ||
    (headerRedesign.isEnabled &&
      (job?.stage.type === AlexaStageType.IDLE || job?.stage.type === AlexaStageType.PROGRESS || job?.stage.type === AlexaStageType.WAIT_ACCOUNT));
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
  diagramState: Creator.diagramStateSelector,
};

const mapDispatchToProps = {
  syncSelectedVendor: Account.syncSelectedVendor,
};

type AlexaUploadButtonConnectedProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(AlexaUploadButton);
