import { Nullable } from '@voiceflow/common';
import { toast } from '@voiceflow/ui';
import React from 'react';

import { ModalType } from '@/constants';
import { AlexaStageType, DialogflowStageType, GoogleStageType } from '@/constants/platforms';
import { AnyJob, PublishContext, PublishContextValue } from '@/contexts';
import { SourceType } from '@/ducks/tracking/constants';
import { useModals, useToggle, useTrackingEvents } from '@/hooks';
import { isNotify, isReady } from '@/utils/job';

type PublishStageType = typeof GoogleStageType | typeof AlexaStageType | typeof DialogflowStageType;

export interface OnStateChangedOptions<T extends GoogleStageType | AlexaStageType | DialogflowStageType> {
  cancel: () => Promise<void>;
  stageType: T | undefined;
  popupOpened: boolean;
}

interface PublishOptions<T extends PublishStageType, J extends AnyJob> {
  StageType: T;
  needsLogin: boolean;
  onStateChanged: (options: OnStateChangedOptions<J['stage']['type']>) => void;
}

export interface BasePublishApi<J extends AnyJob> {
  job: Nullable<J>;
  setJob: (job: Nullable<J>) => void;
  noPopup: boolean;
  onCancel: () => Promise<void>;
  onPublish: (versionName: string) => void;
  needsLogin: boolean;
  popupOpened: boolean;
  togglePopupOpened: (open: boolean) => void;
  successfullyPublished: boolean;
}

export const useBasePublish = <T extends PublishStageType, J extends AnyJob>({
  StageType,
  needsLogin,
  onStateChanged,
}: PublishOptions<T, J>): BasePublishApi<J> => {
  const NO_POPUP_STAGES = [StageType.WAIT_INVOCATION_NAME, StageType.IDLE, StageType.PROGRESS, StageType.WAIT_ACCOUNT];

  const { job, setJob, cancel, publish, updateCurrentStage } = React.useContext(PublishContext)! as PublishContextValue<J>;

  const [trackingEvents] = useTrackingEvents();

  const { open: openLoginModal, close: closeLoginModal, isOpened: loginModalOpened } = useModals(ModalType.CONNECT_PLATFORM);

  const [popupOpened, togglePopupOpened] = useToggle(false);
  const [invalidInvName, setInvalidInvName] = React.useState(false);
  const [waitingForCancel, setWaitingForCancel] = React.useState(false);
  const [successfullyPublished, setSuccessfullyPublished] = React.useState(false);

  const stageType = job?.stage.type;

  const noPopup = !!stageType && NO_POPUP_STAGES.includes(stageType);
  const jobIsReady = isReady(job);

  const source = SourceType.PROJECT;

  const toggleLoginModal = React.useCallback(() => {
    if (!needsLogin) {
      if (loginModalOpened) {
        closeLoginModal();
      } else {
        return;
      }
    }

    if (stageType === StageType.IDLE) {
      openLoginModal({ stage: stageType, onCancel, updateCurrentStage, source });
    } else if (stageType === StageType.WAIT_ACCOUNT) {
      if (loginModalOpened) {
        closeLoginModal();
      }
      openLoginModal({ stage: stageType, onCancel, updateCurrentStage, source });
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

  const onPublish = React.useCallback(
    (versionName: string) => {
      togglePopupOpened(true);
      toggleLoginModal();

      trackingEvents.trackActiveProjectPublishAttempt();

      if (jobIsReady) {
        publish({ versionName });
      }
    },
    [publish, jobIsReady, toggleLoginModal]
  );

  React.useEffect(() => {
    if (stageType === StageType.SUCCESS) {
      setSuccessfullyPublished(true);
    }
  }, [stageType]);

  React.useEffect(() => {
    if (job == null && invalidInvName) {
      setInvalidInvName(false);
      togglePopupOpened(false);
      return;
    }

    if (!popupOpened && isNotify(job) && stageType !== StageType.WAIT_ACCOUNT && !waitingForCancel) {
      togglePopupOpened(true);
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
  }, [popupOpened, stageType, onStateChanged]);

  return {
    job,
    setJob,
    noPopup,
    onCancel,
    onPublish,
    needsLogin,
    popupOpened,
    togglePopupOpened,
    successfullyPublished,
  };
};

export default useBasePublish;
