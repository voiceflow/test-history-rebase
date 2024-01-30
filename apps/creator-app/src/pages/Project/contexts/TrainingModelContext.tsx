import { datadogRum } from '@datadog/browser-rum';
import { BaseModels } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import { logger, System, toast, useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Errors from '@/config/errors';
import { CMSRoute } from '@/config/routes';
import { NLPTrainStageType } from '@/constants/platforms';
import { TrainingContext } from '@/contexts/TrainingContext';
import { Designer } from '@/ducks';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Tracking from '@/ducks/tracking';
import { useDispatch, useSelector, useTrackingEvents } from '@/hooks';
import { createPlatformSelector } from '@/utils/platform';
import { getModelsDiffs, isModelChanged, ModelDiff } from '@/utils/prototypeModel';

export interface TrainingState {
  diff: ModelDiff;
  trainedModel: BaseModels.PrototypeModel | null;
  fetching: boolean;
  lastTrainedTime: number;
}

export const getTrainText = createPlatformSelector(
  {
    [Platform.Constants.PlatformType.ALEXA]: 'Train Alexa Skill',
    [Platform.Constants.PlatformType.GOOGLE]: 'Train Google Action',
  },
  'Train Assistant'
);

export interface TrainingModelContextValue {
  state: TrainingState;
  isTraining: boolean;
  isTrained: boolean;
  getDiff: () => void;
  startTraining: (origin: Tracking.AssistantOriginType) => void;
  cancelTraining: () => void | Promise<void>;
}

export const TrainingModelContext = React.createContext<TrainingModelContextValue>({
  state: {
    diff: {
      slots: { new: [], deleted: [], updated: [] },
      intents: { new: [], deleted: [], updated: [] },
    } as ModelDiff,
    fetching: false,
    trainedModel: null as BaseModels.PrototypeModel | null,
    lastTrainedTime: 0,
  },
  isTrained: false,
  isTraining: false,
  getDiff: () => {},
  startTraining: () => {},
  cancelTraining: () => {},
});

export const TrainingModelProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [trainingState, trainingStateApi] = useSmartReducerV2<TrainingState>({
    diff: {
      slots: { new: [], deleted: [], updated: [] },
      intents: { new: [], deleted: [], updated: [] },
    } as ModelDiff,
    fetching: false,
    trainedModel: null as BaseModels.PrototypeModel | null,
    lastTrainedTime: 0,
  });

  const training = React.useContext(TrainingContext)!;
  const goToCMSResource = useDispatch(Router.goToCMSResource);
  const [trackingEvents] = useTrackingEvents();

  const versionID = useSelector(Session.activeVersionIDSelector);
  const projectID = useSelector(Session.activeProjectIDSelector);
  const getSlot = useSelector(Designer.Entity.selectors.getOneByID);

  const isTrained = !isModelChanged(trainingState.diff) && (!training.job || training.job.stage.type === NLPTrainStageType.SUCCESS);

  React.useEffect(() => {
    if (training.job?.stage.type === NLPTrainStageType.SUCCESS) {
      const invalidSlots = training.job.stage.data?.validations?.invalid.slots
        .map((key) => getSlot({ id: key })?.name)
        .filter(Boolean)
        .join(', ');

      if (invalidSlots?.length) {
        toast.warn(
          <>
            Your slots <b>{invalidSlots}</b> require custom values in order to be properly recognized during testing. Update the{' '}
            <System.Link.Button onClick={() => goToCMSResource(CMSRoute.ENTITY, invalidSlots[0])}>Interaction Model</System.Link.Button> and train
            your assistant again.
          </>,
          { autoClose: false }
        );
      }
    }
  }, [training.job?.stage.type]);

  const startTraining = async (origin: Tracking.AssistantOriginType) => {
    trackingEvents.trackProjectTrainAssistant({ origin });

    try {
      await training.start();
    } catch (err) {
      logger.warn('Train error', err);
      toast.error('An error occurred while training the model.');
    }
  };

  const getDiff = async () => {
    if (!projectID) {
      datadogRum.addError(Errors.noActiveProjectID());
      toast.genericError();
      return;
    }

    if (!versionID) {
      datadogRum.addError(Errors.noActiveVersionID());
      toast.genericError();
      return;
    }

    try {
      trainingStateApi.update({ fetching: true });

      const [projectPrototype, versionPrototype] = await Promise.all([
        client.api.project.getPrototype(projectID),
        client.api.version.getPrototype(versionID),
      ] as const);

      trainingStateApi.update({
        diff: getModelsDiffs(projectPrototype?.trainedModel ?? { slots: [], intents: [] }, versionPrototype.model),
        fetching: false,
        trainedModel: projectPrototype?.trainedModel ?? null,
        lastTrainedTime: projectPrototype?.lastTrainedTime ?? Date.now(),
      });
    } catch {
      trainingStateApi.update({ fetching: false });
    }
  };

  React.useEffect(() => {
    if (!training.active) {
      getDiff();
    }
  }, [training.active]);

  const api = {
    state: trainingState,
    startTraining,
    cancelTraining: training.cancel,
    getDiff,
    isTraining: training.active,
    isTrained,
  };

  return <TrainingModelContext.Provider value={api}>{children}</TrainingModelContext.Provider>;
};
