import { logger, toast, useContextApi } from '@voiceflow/ui';
import { usePersistFunction } from '@voiceflow/ui-next';
import React, { useEffect } from 'react';

import { NLUTrainingDiffStatus } from '@/constants/enums/nlu-training-diff-status.enum';
import { NLPTrainStageType } from '@/constants/platforms';
import { TrainingContext } from '@/contexts/TrainingContext';
import { Designer, Tracking } from '@/ducks';
import { useDispatch, useSelector, useTrackingEvents } from '@/hooks';

import { useNLUTrainingModelNotifications } from './NLUTrainingModel.hook';

export interface NLUTrainingModelContextValue {
  start: (origin: Tracking.AssistantOriginType) => void;
  cancel: () => Promise<void>;
  isTrained: boolean;
  isTraining: boolean;
  calculateDiff: VoidFunction;
}

export const NLUTrainingModelContext = React.createContext<NLUTrainingModelContextValue>({
  start: () => {},
  cancel: () => Promise.resolve(),
  isTrained: false,
  isTraining: false,
  calculateDiff: () => {},
});

export const NLUTrainingModelProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const training = React.useContext(TrainingContext)!;
  const [trackingEvents] = useTrackingEvents();

  const nluTrainingDiffStatus = useSelector(Designer.Environment.selectors.nluTrainingDiffStatus);

  const setNLUTrainingDiffStatus = useDispatch(Designer.Environment.action.SetNLUTrainingDiffStatus);
  const calculateNLUTrainingDiff = useDispatch(Designer.Environment.effect.calculateNLUTrainingDiff);

  const start = usePersistFunction(async (origin: Tracking.AssistantOriginType) => {
    trackingEvents.trackProjectTrainAssistant({ origin });

    try {
      setNLUTrainingDiffStatus({ status: NLUTrainingDiffStatus.UNKNOWN });

      await training.start();
    } catch (err) {
      logger.warn('Train error', err);
      toast.error('An error occurred while training the model.');
    }
  });

  const calculateDiff = usePersistFunction(() => {
    if (training.active) return;
    // no need to recalculate if status is already known
    if (nluTrainingDiffStatus !== NLUTrainingDiffStatus.UNKNOWN) return;

    calculateNLUTrainingDiff();
  });

  useEffect(() => calculateDiff(), [training.active]);

  useNLUTrainingModelNotifications();

  const api = useContextApi({
    start,
    cancel: training.cancel,
    isTrained: nluTrainingDiffStatus === NLUTrainingDiffStatus.TRAINED && (!training.job || training.job.stage.type === NLPTrainStageType.SUCCESS),
    isTraining: training.active,
    calculateDiff,
  });

  return <NLUTrainingModelContext.Provider value={api}>{children}</NLUTrainingModelContext.Provider>;
};
