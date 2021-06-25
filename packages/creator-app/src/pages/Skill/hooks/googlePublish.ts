import { toast } from '@voiceflow/ui';
import React from 'react';

import { DiagramState, ModalType } from '@/constants';
import { GoogleStageType } from '@/constants/platforms';
import * as Account from '@/ducks/account';
import * as Creator from '@/ducks/creator';
import { useDidUpdateEffect, useDispatch, useModals, useSelector, useSetup, useToggle, useTrackingEvents } from '@/hooks';
import { GooglePublishJob } from '@/models';
import { isNotify, isReady } from '@/utils/job';

import { PublishContext, PublishContextValue } from '../contexts';

const NO_POPUP_STAGES = [GoogleStageType.WAIT_INVOCATION_NAME, GoogleStageType.IDLE, GoogleStageType.PROGRESS, GoogleStageType.WAIT_ACCOUNT];

// eslint-disable-next-line import/prefer-default-export
export const useGooglePublish = () => {
  const google = useSelector(Account.googleAccountSelector);
  const diagramState = useSelector(Creator.diagramStateSelector);

  const loadGoogleAccount = useDispatch(Account.google.loadAccount);

  const { job, publish, updateCurrentStage, cancel } = React.useContext(PublishContext)! as PublishContextValue<GooglePublishJob.AnyJob>;

  const { open: openLoginModal, close: closeLoginModal, isOpened: loginModalOpened } = useModals(ModalType.CONNECT);

  const [trackingEvents] = useTrackingEvents();

  const [popupOpened, togglePopupOpened] = useToggle(false);
  const [multiProjects, setMultiProjects] = React.useState(false);
  const [invalidInvName, setInvalidInvName] = React.useState(false);
  const [waitingForCancel, setWaitingForCancel] = React.useState(false);
  const [successfullyPublished, setSuccessfullyPublished] = React.useState(false);

  const stageType = job?.stage.type;
  const needsLogin = !google;
  const noPopup = !!stageType && NO_POPUP_STAGES.includes(stageType);
  const jobIsReady = isReady(job);

  const toggleLoginModal = React.useCallback(() => {
    if (!needsLogin) {
      if (loginModalOpened) {
        closeLoginModal();
      } else {
        return;
      }
    }

    if (stageType === GoogleStageType.IDLE) {
      openLoginModal({ stage: stageType, updateCurrentStage });
    } else if (stageType === GoogleStageType.WAIT_ACCOUNT) {
      if (loginModalOpened) {
        closeLoginModal();
        openLoginModal({ stage: stageType, updateCurrentStage });
      } else if (popupOpened) {
        openLoginModal({ stage: stageType, updateCurrentStage });
      }
    } else {
      closeLoginModal();
    }
  }, [needsLogin, stageType, loginModalOpened, closeLoginModal, openLoginModal, updateCurrentStage]);

  const onCancel = React.useCallback(async () => {
    togglePopupOpened(false);
    setWaitingForCancel(true);

    await cancel();

    setWaitingForCancel(false);
  }, [cancel]);

  const onPublish = React.useCallback(() => {
    trackingEvents.trackActiveProjectPublishAttempt();

    if (jobIsReady) {
      publish();
    }

    togglePopupOpened(true);

    toggleLoginModal();
  }, [jobIsReady, toggleLoginModal]);

  useSetup(() => loadGoogleAccount());

  useDidUpdateEffect(() => {
    if (diagramState === DiagramState.SAVING) {
      setSuccessfullyPublished(false);
    }
  }, [diagramState]);

  React.useEffect(() => {
    if (stageType === GoogleStageType.SUCCESS) {
      setSuccessfullyPublished(true);
    }
  }, [stageType]);

  React.useEffect(() => {
    if (job == null && invalidInvName) {
      setInvalidInvName(false);
      togglePopupOpened(false);
      return;
    }

    if (!popupOpened && isNotify(job) && stageType !== GoogleStageType.WAIT_ACCOUNT && !waitingForCancel) {
      togglePopupOpened(true);
    }

    toggleLoginModal();

    if (stageType === GoogleStageType.SUCCESS) {
      trackingEvents.trackActiveProjectPublishSuccess();
    }

    if (popupOpened && stageType === GoogleStageType.WAIT_INVOCATION_NAME) {
      cancel();
      setInvalidInvName(true);
      toast.error('Invalid invocation name. Please update your invocation name in settings and try again.');
    }

    // reset multiProjects when the job finishes,
    // user should be able to select vendor on every upload attempt
    if (stageType === GoogleStageType.SUCCESS || stageType === GoogleStageType.ERROR) {
      setMultiProjects(false);
    }
  }, [popupOpened, stageType]);

  return {
    job,
    noPopup,
    onCancel,
    onPublish,
    needsLogin,
    popupOpened,
    multiProjects,
    setMultiProjects,
    successfullyPublished,
  };
};
