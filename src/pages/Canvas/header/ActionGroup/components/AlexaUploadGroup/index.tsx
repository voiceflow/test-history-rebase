import React from 'react';

import { toast } from '@/components/Toast';
import { DiagramState, JobStatus, ModalType } from '@/constants';
import { AlexaStageType } from '@/constants/platforms';
import * as Account from '@/ducks/account';
import * as Creator from '@/ducks/creator';
import { connect } from '@/hocs';
import { useModals, useToggle, useTrackingEvents } from '@/hooks';
import { Alexa } from '@/pages/Publish/Upload';
import SelectVendorStage from '@/pages/Publish/Upload/Alexa/SelectVendorStage';
import { PublishContext } from '@/pages/Skill/contexts';
import { useCanvasMode } from '@/pages/Skill/hooks';
import { ConnectedProps } from '@/types';
import { isNotify, isReady, isRunning } from '@/utils/job';

import { ConnectButton, LoadingButton, SuccessButton, UploadButton } from '../ActionButtons';
import UploadPopup from '../UploadPopup';

const AlexaUploadButton: React.FC<AlexaUploadButtonConnectedProps> = ({ amazon, syncSelectedVendor, diagramState, vendors }) => {
  const isCanvasMode = useCanvasMode();

  const { job, cancel, publish, updateCurrentStage } = React.useContext(PublishContext)!;

  const [persistSuccess, setPersistSuccess] = React.useState(false);

  const multiVendors = vendors.length > 1;
  const [vendorSelected, setVendorSelected] = React.useState(false);

  const showSelectVendor = !vendorSelected && job?.status !== JobStatus.FINISHED;

  const [opened, onToggle] = useToggle(false);
  const [waitingForCancel, setWaitingForCancel] = React.useState(false);
  const { open: openLoginModal, close: closeLoginModal, isOpened: loginModalOpen } = useModals(ModalType.CONNECT);
  const [trackingEvents] = useTrackingEvents();
  const [invalidInvName, setInvalidInvName] = React.useState(false);

  const needsLogin = !amazon;

  const noPopup =
    job?.stage.type === AlexaStageType.WAIT_INVOCATION_NAME ||
    job?.stage.type === AlexaStageType.IDLE ||
    job?.stage.type === AlexaStageType.PROGRESS ||
    job?.stage.type === AlexaStageType.WAIT_ACCOUNT;

  const toggleLoginModal = () => {
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
    onToggle(true);
    toggleLoginModal();
    if (vendorSelected) {
      trackingEvents.trackActiveProjectPublishAttempt();
      if (isReady(job)) {
        publish();
      }
    }
  };

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

  React.useEffect(() => {
    setVendorSelected(!multiVendors);
  }, [multiVendors]);

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

    // let the user set valid invocation name before proceeding
    if (opened && job?.stage.type === AlexaStageType.WAIT_INVOCATION_NAME) {
      cancel();
      setInvalidInvName(true);
      toast.error('Invalid invocation name. Please update your invocation name in settings and try again.');
    }

    // let the user select vendor before proceeding
    if (opened && !vendorSelected && job?.stage.type === AlexaStageType.PROGRESS) {
      cancel();
    }

    // reset vendorSelected when the job finishes,
    // user should be able to select vendor on every upload attempt
    if (job?.stage.type === AlexaStageType.SUCCESS || job?.stage.type === AlexaStageType.ERROR) {
      setVendorSelected(!multiVendors);
    }
  }, [opened, job?.stage.type, needsLogin, vendorSelected]);

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
    if (opened && showSelectVendor) {
      return <LoadingButton spin={false} active />;
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
  }, [job?.stage.type, needsLogin, persistSuccess, opened, loginModalOpen, vendorSelected]);

  return (
    <>
      {isCanvasMode && <AlexaButton />}
      <UploadPopup multiSelect={showSelectVendor} open={opened && (!vendorSelected || !noPopup)} onClose={onClose} jobStage={job?.stage.type}>
        {showSelectVendor ? <SelectVendorStage setVendorSelected={setVendorSelected} /> : !noPopup && <Alexa />}
      </UploadPopup>
    </>
  );
};

const mapStateToProps = {
  amazon: Account.amazonAccountSelector,
  diagramState: Creator.diagramStateSelector,
  vendors: Account.amazonVendorsSelector,
};

const mapDispatchToProps = {
  syncSelectedVendor: Account.syncSelectedVendor,
};

type AlexaUploadButtonConnectedProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(AlexaUploadButton);
