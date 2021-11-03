import { toast } from '@voiceflow/ui';
import React from 'react';

import { DiagramState, ModalType } from '@/constants';
import { AlexaStageType, DialogflowStageType, GoogleStageType } from '@/constants/platforms';
import { PublishContext, PublishContextValue } from '@/contexts';
import * as Creator from '@/ducks/creator';
import { useDidUpdateEffect, useLazyState, useModals, useSelector, useTrackingEvents } from '@/hooks';
import { AlexaPublishJob, DialogflowPublishJob, GooglePublishJob } from '@/models';
import { Nullable } from '@/types';
import { isNotify, isReady } from '@/utils/job';

type PublishStageType = typeof GoogleStageType | typeof AlexaStageType | typeof DialogflowStageType;
type PublishJob = AlexaPublishJob.AnyJob | GooglePublishJob.AnyJob | DialogflowPublishJob.AnyJob;

export interface OnStateChangedOptions<T extends GoogleStageType | AlexaStageType | DialogflowStageType> {
  cancel: () => Promise<void>;
  stageType: T | undefined;
  popupOpened: boolean;
}

interface PublishOptions<T extends PublishStageType, J extends PublishJob> {
  StageType: T;
  needsLogin: boolean;
  canBePublished?: boolean;
  onStateChanged: (options: OnStateChangedOptions<J['stage']['type']>) => void;
}

export interface BasePublishApi<J extends PublishJob> {
  job: Nullable<J>;
  noPopup: boolean;
  onCancel: () => Promise<void>;
  onPublish: VoidFunction;
  needsLogin: boolean;
  popupOpened: boolean;
  successfullyPublished: boolean;
}

export const useBasePublish = <T extends PublishStageType, J extends PublishJob>({
  StageType,
  needsLogin,
  canBePublished = true,
  onStateChanged,
}: PublishOptions<T, J>): BasePublishApi<J> => {
  const waitAccountStages = [StageType.WAIT_ACCOUNT, StageType.FORCE_WAIT_ACCOUNT];
  const noPopupStages = [StageType.WAIT_INVOCATION_NAME, StageType.IDLE, StageType.PROGRESS, ...waitAccountStages];

  const { job, cancel, publish, updateCurrentStage } = React.useContext(PublishContext)! as PublishContextValue<J>;

  const [trackingEvents] = useTrackingEvents();

  const { open: openLoginModal, close: closeLoginModal, isOpened: loginModalOpened } = useModals(ModalType.CONNECT);

  const diagramState = useSelector(Creator.diagramStateSelector);

  const [isPopupOpened, setPopupOpened] = useLazyState(false);
  const [invalidInvName, setInvalidInvName] = React.useState(false);
  const [waitingForCancel, setWaitingForCancel] = React.useState(false);
  const [successfullyPublished, setSuccessfullyPublished] = React.useState(false);

  const stageType = job?.stage.type;

  const noPopup = !!stageType && noPopupStages.includes(stageType);
  const jobIsReady = isReady(job);

  const toggleLoginModal = React.useCallback(() => {
    if (!needsLogin && stageType !== StageType.FORCE_WAIT_ACCOUNT) {
      if (loginModalOpened) {
        closeLoginModal();
      } else {
        return;
      }
    }

    if (stageType === StageType.IDLE) {
      openLoginModal({ stage: stageType, onCancel, updateCurrentStage });
    } else if (waitAccountStages.includes(stageType!)) {
      if (loginModalOpened) {
        closeLoginModal();
        openLoginModal({ stage: stageType, onCancel, updateCurrentStage });
      } else if (isPopupOpened()) {
        openLoginModal({ stage: stageType, onCancel, updateCurrentStage });
      }
    } else {
      closeLoginModal();
    }
  }, [needsLogin, stageType, loginModalOpened, closeLoginModal, openLoginModal, updateCurrentStage]);

  const onCancel = React.useCallback(async () => {
    setPopupOpened(false);
    setWaitingForCancel(true);

    await cancel();

    setWaitingForCancel(false);
  }, [cancel]);

  const onPublish = React.useCallback(() => {
    setPopupOpened(true);
    toggleLoginModal();

    if (canBePublished) {
      trackingEvents.trackActiveProjectPublishAttempt();

      if (jobIsReady) {
        publish();
      }
    }
  }, [publish, jobIsReady, canBePublished, toggleLoginModal]);

  useDidUpdateEffect(() => {
    if (diagramState === DiagramState.SAVING) {
      setSuccessfullyPublished(false);
    }
  }, [diagramState]);

  React.useEffect(() => {
    if (stageType === StageType.SUCCESS) {
      setSuccessfullyPublished(true);
    }
  }, [stageType]);

  React.useEffect(() => {
    if (job == null && invalidInvName) {
      setInvalidInvName(false);
      setPopupOpened(false);
      return;
    }

    const popupOpened = isPopupOpened();

    if (!popupOpened && isNotify(job) && !waitAccountStages.includes(stageType!) && !waitingForCancel) {
      setPopupOpened(true);
    }

    if (stageType === StageType.FORCE_WAIT_ACCOUNT) {
      setPopupOpened(true);
    }

    toggleLoginModal();

    if (stageType === StageType.SUCCESS) {
      trackingEvents.trackActiveProjectPublishSuccess();
    }

    // let the user set valid invocation name before proceeding
    if (popupOpened && stageType === StageType.WAIT_INVOCATION_NAME) {
      cancel();
      setInvalidInvName(true);
      toast.error('Invalid invocation name. Please update your invocation name in settings and try again.');
    }

    onStateChanged({ cancel, stageType, popupOpened });
  }, [stageType, onStateChanged]);

  return {
    job,
    noPopup,
    onCancel,
    onPublish,
    needsLogin,
    popupOpened: isPopupOpened(),
    successfullyPublished,
  };
};

export default useBasePublish;
