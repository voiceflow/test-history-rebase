import { useContextApi } from '@voiceflow/ui';
import { notify, usePersistFunction } from '@voiceflow/ui-next';
import React, { useEffect } from 'react';

import { NLUTrainingDiffStatus } from '@/constants/enums/nlu-training-diff-status.enum';
import { NLPTrainStageType } from '@/constants/platforms';
import { TrainingContext } from '@/contexts/TrainingContext';
import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { useTrackingEvents } from '@/hooks/tracking';
import { logger } from '@/utils/logger';

import { useNLUTrainingModelNotifications } from './NLUTrainingModel.hook';

export interface NLUTrainingModelContextValue {
  start: (options?: { origin?: string }) => Promise<boolean>;
  cancel: () => Promise<void>;
  isFailed: boolean;
  isTrained: boolean;
  diffStatus: NLUTrainingDiffStatus;
  isTraining: boolean;
  calculateDiff: () => Promise<void>;
}

export const NLUTrainingModelContext = React.createContext<NLUTrainingModelContextValue>({
  start: () => Promise.resolve(false),
  cancel: () => Promise.resolve(),
  isFailed: false,
  isTrained: false,
  isTraining: false,
  diffStatus: NLUTrainingDiffStatus.UNKNOWN,
  calculateDiff: () => Promise.resolve(),
});

export const NLUTrainingModelProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const training = React.useContext(TrainingContext)!;
  const [trackingEvents] = useTrackingEvents();

  const nluTrainingDiffStatus = useSelector(Designer.Environment.selectors.nluTrainingDiffStatus);

  const setNLUTrainingDiffStatus = useDispatch(Designer.Environment.action.SetNLUTrainingDiffStatus);
  const calculateNLUTrainingDiff = useDispatch(Designer.Environment.effect.calculateNLUTrainingDiff);

  const start = usePersistFunction(async ({ origin }: { origin?: string } = {}) => {
    trackingEvents.trackProjectTrainAssistant({ origin });

    try {
      setNLUTrainingDiffStatus({ status: NLUTrainingDiffStatus.UNKNOWN });

      await training.start();

      return true;
    } catch (err) {
      logger.warn('Train error', err);
      notify.long.warning('Agent training failed, please try again. If the issue continues contact our support team.', {
        pauseOnHover: true,
        bodyClassName: 'vfui',
      });

      return false;
    }
  });

  const calculateDiff = usePersistFunction(async () => {
    if (training.active) return;
    // no need to recalculate if status is already known
    if (nluTrainingDiffStatus !== NLUTrainingDiffStatus.UNKNOWN) return;

    await calculateNLUTrainingDiff();
  });

  useEffect(() => {
    calculateDiff();
  }, [training.active]);

  useNLUTrainingModelNotifications();

  const api = useContextApi({
    start,
    cancel: training.cancel,
    isFailed: training?.job?.stage?.type === NLPTrainStageType.ERROR,
    isTrained: nluTrainingDiffStatus === NLUTrainingDiffStatus.TRAINED && (!training.job || training.job.stage.type === NLPTrainStageType.SUCCESS),
    isTraining: training.active,
    diffStatus: nluTrainingDiffStatus,
    calculateDiff,
  });

  return <NLUTrainingModelContext.Provider value={api}>{children}</NLUTrainingModelContext.Provider>;
};
