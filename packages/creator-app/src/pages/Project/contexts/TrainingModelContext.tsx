import { BaseModels } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { ClickableText, logger, toast, useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Errors from '@/config/errors';
import { NLURoute } from '@/config/routes';
import { NLPTrainStageType } from '@/constants/platforms';
import { TrainingContext } from '@/contexts/TrainingContext';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as PrototypeDuck from '@/ducks/prototype';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Tracking from '@/ducks/tracking';
import { useDispatch, useFeature, useSelector, useTrackingEvents } from '@/hooks';
import { createPlatformSelector } from '@/utils/platform';
import { getModelsDiffs, isModelChanged, ModelDiff } from '@/utils/prototypeModel';
import * as Sentry from '@/vendors/sentry';

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

export const TrainingModelProvider: React.FC = ({ children }) => {
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
  const validateModel = useDispatch(PrototypeDuck.validateModel);
  const goToInteractionModel = useDispatch(Router.goToInteractionModel);
  const [trackingEvents] = useTrackingEvents();
  const nluManager = useFeature(Realtime.FeatureFlag.NLU_MANAGER);
  const goToCurrentNLUManagerTab = useDispatch(Router.goToCurrentNLUManagerTab);

  const domainID = useSelector(Session.activeDomainIDSelector);
  const versionID = useSelector(Session.activeVersionIDSelector);
  const diagramID = useSelector(CreatorV2.activeDiagramIDSelector);
  const projectID = useSelector(Session.activeProjectIDSelector);

  const isTrained = !isModelChanged(trainingState.diff) && (!training.job || training.job.stage.type === NLPTrainStageType.SUCCESS);

  const handleGoToIMM = (slotID: string) => {
    if (nluManager.isEnabled) {
      goToCurrentNLUManagerTab(NLURoute.ENTITIES, slotID);
    } else if (domainID && versionID && diagramID) {
      goToInteractionModel({ domainID, versionID, diagramID, modelType: 'slots', entityID: slotID });
    }
  };

  const startTraining = async (origin: Tracking.AssistantOriginType) => {
    trackingEvents.trackProjectTrainAssistant({ origin });

    try {
      const { invalid } = await validateModel();
      if (invalid.slots.length) {
        toast.warn(
          <>
            Your slots <b>({invalid.slots.map(({ name }) => name).join(', ')})</b> require custom values in order to be properly recognized during
            testing. Update the <ClickableText onClick={() => handleGoToIMM(invalid.slots[0].key)}>Interaction Model</ClickableText> and train your
            assistant again.
          </>
        );
      }
      await training.start();
    } catch (err) {
      logger.warn('Train error', err);
      toast.error('An error occurred while training the model.');
    }
  };

  const getDiff = async () => {
    if (!projectID) {
      Sentry.error(Errors.noActiveProjectID());
      toast.genericError();
      return;
    }

    if (!versionID) {
      Sentry.error(Errors.noActiveVersionID());
      toast.genericError();
      return;
    }

    try {
      trainingStateApi.update({ fetching: true });

      await client.platform.general.nlp.getApp(projectID);

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
