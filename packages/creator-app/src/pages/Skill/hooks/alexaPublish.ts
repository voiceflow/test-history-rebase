import { toast } from '@voiceflow/ui';
import React from 'react';

import { DiagramState, ModalType } from '@/constants';
import { AlexaStageType } from '@/constants/platforms';
import * as Account from '@/ducks/account';
import * as Creator from '@/ducks/creator';
import { useDidUpdateEffect, useDispatch, useModals, useSelector, useSetup, useToggle, useTrackingEvents } from '@/hooks';
import { AlexaPublishJob } from '@/models';
import { isFinished, isNotify, isReady } from '@/utils/job';

import { PublishContext, PublishContextValue } from '../contexts';

const NO_POPUP_STAGES = [AlexaStageType.WAIT_INVOCATION_NAME, AlexaStageType.IDLE, AlexaStageType.PROGRESS, AlexaStageType.WAIT_ACCOUNT];

// eslint-disable-next-line import/prefer-default-export
export const useAlexaPublish = () => {
  const { job, cancel, publish, updateCurrentStage } = React.useContext(PublishContext)! as PublishContextValue<AlexaPublishJob.AnyJob>;

  const amazon = useSelector(Account.amazonAccountSelector);
  const vendors = useSelector(Account.amazonVendorsSelector);
  const diagramState = useSelector(Creator.diagramStateSelector);

  const syncSelectedVendor = useDispatch(Account.amazon.syncSelectedVendor);

  const { open: openLoginModal, close: closeLoginModal, isOpened: loginModalOpened } = useModals(ModalType.CONNECT);

  const [trackingEvents] = useTrackingEvents();

  const [popupOpened, togglePopupOpened] = useToggle(false);

  const multiVendors = vendors.length > 1;

  const [vendorSelected, setVendorSelected] = React.useState(!multiVendors);
  const [invalidInvName, setInvalidInvName] = React.useState(false);
  const [waitingForCancel, setWaitingForCancel] = React.useState(false);
  const [successfullyPublished, setSuccessfullyPublished] = React.useState(false);

  const stageType = job?.stage.type;
  const needsLogin = !amazon;

  const noPopup = !!stageType && NO_POPUP_STAGES.includes(stageType);
  const jobIsReady = isReady(job);
  const showSelectVendor = !vendorSelected && !isFinished(job);

  const toggleLoginModal = React.useCallback(() => {
    if (!needsLogin) {
      if (loginModalOpened) {
        closeLoginModal();
      } else {
        return;
      }
    }

    if (stageType === AlexaStageType.IDLE) {
      openLoginModal({ stage: stageType, updateCurrentStage });
    } else if (stageType === AlexaStageType.WAIT_ACCOUNT) {
      if (loginModalOpened) {
        closeLoginModal();
        openLoginModal({ stage: stageType, updateCurrentStage });
      } else if (popupOpened) {
        openLoginModal({ stage: stageType, updateCurrentStage });
      }
    } else {
      closeLoginModal();
    }
  }, [needsLogin, stageType, popupOpened, loginModalOpened, closeLoginModal, openLoginModal, updateCurrentStage]);

  const onCancel = React.useCallback(async () => {
    togglePopupOpened(false);
    setWaitingForCancel(true);

    await cancel();

    setWaitingForCancel(false);
  }, [cancel]);

  const onPublish = React.useCallback(() => {
    togglePopupOpened(true);
    toggleLoginModal();

    if (vendorSelected) {
      trackingEvents.trackActiveProjectPublishAttempt();

      if (jobIsReady) {
        publish();
      }
    }
  }, [publish, jobIsReady, vendorSelected, toggleLoginModal]);

  useSetup(() => syncSelectedVendor());

  useDidUpdateEffect(() => {
    if (diagramState === DiagramState.SAVING) {
      setSuccessfullyPublished(false);
    }
  }, [diagramState]);

  useDidUpdateEffect(() => {
    setVendorSelected(!multiVendors);
  }, [multiVendors]);

  React.useEffect(() => {
    if (stageType === AlexaStageType.SUCCESS) {
      setSuccessfullyPublished(true);
    }
  }, [stageType]);

  React.useEffect(() => {
    if (job == null && invalidInvName) {
      setInvalidInvName(false);
      togglePopupOpened(false);
      return;
    }

    if (!popupOpened && isNotify(job) && stageType !== AlexaStageType.WAIT_ACCOUNT && !waitingForCancel) {
      togglePopupOpened(true);
    }

    toggleLoginModal();

    if (stageType === AlexaStageType.SUCCESS) {
      trackingEvents.trackActiveProjectPublishSuccess();
    }

    // let the user set valid invocation name before proceeding
    if (popupOpened && stageType === AlexaStageType.WAIT_INVOCATION_NAME) {
      cancel();
      setInvalidInvName(true);
      toast.error('Invalid invocation name. Please update your invocation name in settings and try again.');
    }

    // let the user select vendor before proceeding
    if (popupOpened && !vendorSelected && stageType === AlexaStageType.PROGRESS) {
      cancel();
    }

    // reset vendorSelected when the job finishes,
    // user should be able to select vendor on every upload attempt
    if (stageType === AlexaStageType.SUCCESS || stageType === AlexaStageType.ERROR) {
      setVendorSelected(!multiVendors);
    }
  }, [popupOpened, stageType, vendorSelected]);

  return {
    job,
    noPopup,
    onCancel,
    onPublish,
    needsLogin,
    popupOpened,
    vendorSelected,
    showSelectVendor,
    setVendorSelected,
    successfullyPublished,
  };
};
