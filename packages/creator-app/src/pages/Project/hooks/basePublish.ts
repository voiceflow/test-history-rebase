import { Nullable } from '@voiceflow/common';
import { toast } from '@voiceflow/ui';
import React from 'react';

import { AlexaStageType, DialogflowStageType, GoogleStageType } from '@/constants/platforms';
import { AnyJob, PublishContext, PublishContextValue } from '@/contexts';
import { SourceType } from '@/ducks/tracking/constants';
import { useToggle, useTrackingEvents } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
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

  const connectPlatformModal = ModalsV2.useModal(ModalsV2.Platform.Connect);

  const [popupOpened, togglePopupOpened] = useToggle(false);
  const [invalidInvName, setInvalidInvName] = React.useState(false);
  const [successfullyPublished, setSuccessfullyPublished] = React.useState(false);

  const waitingForCancelRef = React.useRef(false);

  const stageType = job?.stage.type;

  const noPopup = !!stageType && NO_POPUP_STAGES.includes(stageType);
  const jobIsReady = isReady(job);

  const toggleLoginModal = React.useCallback(async () => {
    if (!needsLogin && !connectPlatformModal.opened) {
      return;
    }

    if (stageType === StageType.IDLE || stageType === StageType.WAIT_ACCOUNT) {
      try {
        const account = await connectPlatformModal.open({ stage: stageType, source: SourceType.PROJECT }, { reopen: connectPlatformModal.opened });

        updateCurrentStage(account);
      } catch {
        onCancel();
      }
    } else if (connectPlatformModal.opened) {
      connectPlatformModal.close();
    }
  }, [needsLogin, stageType, popupOpened, connectPlatformModal, updateCurrentStage]);

  const onCancel = React.useCallback(async () => {
    waitingForCancelRef.current = true;

    togglePopupOpened(false);

    try {
      await cancel();
    } finally {
      waitingForCancelRef.current = false;
    }
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
    } else if (successfullyPublished) {
      setSuccessfullyPublished(false);
    }
  }, [stageType]);

  React.useEffect(() => {
    if (job == null && invalidInvName) {
      setInvalidInvName(false);
      togglePopupOpened(false);
      return;
    }

    if (!popupOpened && isNotify(job) && stageType !== StageType.WAIT_ACCOUNT && !waitingForCancelRef.current) {
      togglePopupOpened(true);
    }

    if (!waitingForCancelRef.current) {
      toggleLoginModal();
    }

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
