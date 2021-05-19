import React from 'react';

import { toast } from '@/components/Toast';
import { DiagramState, ModalType } from '@/constants';
import { GoogleStageType } from '@/constants/platforms';
import * as Account from '@/ducks/account';
import * as Creator from '@/ducks/creator';
import { connect } from '@/hocs';
import { useModals, useToggle, useTrackingEvents } from '@/hooks';
import { Google } from '@/pages/Publish/Upload';
import WaitProjectStage from '@/pages/Publish/Upload/Google/WaitProjectStage';
import { PublishContext } from '@/pages/Skill/contexts';
import { useCanvasMode } from '@/pages/Skill/hooks';
import { ConnectedProps } from '@/types';
import { isNotify, isReady, isRunning } from '@/utils/job';

import { ConnectButton, LoadingButton, SuccessButton, UploadButton } from '../ActionButtons';
import UploadPopup from '../UploadPopup';
import Button from './Button';

const GoogleUploadButton: React.FC<GoogleUploadButtonConnectedProps> = ({ google, diagramState, loadGoogleAccount }) => {
  const isCanvasMode = useCanvasMode();

  const { job, publish, updateCurrentStage, cancel } = React.useContext(PublishContext)!;
  const [persistSuccess, setPersistSuccess] = React.useState(false);

  React.useEffect(() => {
    if (job?.stage.type === GoogleStageType.SUCCESS) {
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

  const needsLogin = !google;

  const toggleLoginModal = () => {
    if (!needsLogin) {
      if (loginModalOpen) {
        closeLoginModal();
      } else {
        return;
      }
    }
    if (job?.stage.type === GoogleStageType.IDLE) {
      openLoginModal({ stage: job?.stage.type, updateCurrentStage });
    } else if (job?.stage.type === GoogleStageType.WAIT_ACCOUNT) {
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

    if (!opened && isNotify(job) && job?.stage.type !== GoogleStageType.WAIT_ACCOUNT && !waitingForCancel) {
      onToggle(true);
    }

    toggleLoginModal();

    if (job?.stage.type === GoogleStageType.SUCCESS) {
      trackingEvents.trackActiveProjectPublishSuccess();
    }

    if (opened && job?.stage.type === GoogleStageType.WAIT_INVOCATION_NAME) {
      cancel();
      setInvalidInvName(true);
      toast.error('Invalid invocation name. Please update your invocation name in settings and try again.');
    }
  }, [opened, job?.stage.type]);

  React.useEffect(() => {
    loadGoogleAccount();
  }, []);

  const GoogleButton = React.useCallback(() => {
    if (needsLogin) {
      return <ConnectButton onClick={onClick} />;
    }
    if (persistSuccess) {
      return <SuccessButton />;
    }

    switch (job?.stage.type) {
      case GoogleStageType.WAIT_ACCOUNT:
      case GoogleStageType.WAIT_PROJECT:
        return <ConnectButton onClick={onClick} />;
      case GoogleStageType.IDLE:
      case GoogleStageType.PROGRESS:
        return <LoadingButton openTooltip={job?.stage.type === GoogleStageType.PROGRESS} />;
      case GoogleStageType.SUCCESS:
        return <SuccessButton />;
      case GoogleStageType.WAIT_INVOCATION_NAME:
      default:
        return <UploadButton onClick={onClick} isJobActive={isRunning(job)} />;
    }
  }, [job?.stage.type, needsLogin, persistSuccess, opened, loginModalOpen]);

  const noPopup =
    job?.stage.type === GoogleStageType.WAIT_INVOCATION_NAME ||
    job?.stage.type === GoogleStageType.IDLE ||
    job?.stage.type === GoogleStageType.PROGRESS ||
    job?.stage.type === GoogleStageType.WAIT_ACCOUNT;

  return (
    <>
      {isCanvasMode ? <GoogleButton /> : <Button onClick={onClick} isActive={isRunning(job)} />}
      {job?.stage.type === GoogleStageType.WAIT_PROJECT ? (
        <WaitProjectStage open={opened && !noPopup} onClose={onClose} updateCurrentStage={updateCurrentStage} cancel={cancel} />
      ) : (
        <UploadPopup open={opened && !noPopup} onClose={onClose} jobStage={job?.stage.type}>
          {!noPopup && <Google />}
        </UploadPopup>
      )}
    </>
  );
};

const mapStateToProps = {
  google: Account.googleAccountSelector,
  diagramState: Creator.diagramStateSelector,
};

const mapDispatchToProps = {
  loadGoogleAccount: Account.google.loadAccount,
};

type GoogleUploadButtonConnectedProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(GoogleUploadButton);
