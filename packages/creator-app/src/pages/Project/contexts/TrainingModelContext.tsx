import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { ClickableText, logger, toast, useSmartReducerV2 } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import client from '@/client';
import * as Errors from '@/config/errors';
import { InteractionModelTabType } from '@/constants';
import { NLPTrainStageType } from '@/constants/platforms';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as PrototypeDuck from '@/ducks/prototype';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Tracking from '@/ducks/tracking';
import { useDispatch, useFeature, useSelector, useTrackingEvents } from '@/hooks';
import { createPlatformSelector } from '@/utils/platform';
import { getModelsDiffs, isModelChanged, ModelDiff } from '@/utils/prototypeModel';
import * as Sentry from '@/vendors/sentry';

import { NLPContext } from './NLPContext';

export interface TrainingState {
  diff: ModelDiff;
  trainedModel: BaseModels.PrototypeModel | null;
  fetching: boolean;
  lastTrainedTime: number;
}

export const getTrainText = createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: 'Train Alexa Skill',
    [VoiceflowConstants.PlatformType.GOOGLE]: 'Train Google Action',
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

  const nlp = React.useContext(NLPContext)!;
  const validateModel = useDispatch(PrototypeDuck.validateModel);
  const goToInteractionModel = useDispatch(Router.goToInteractionModel);
  const [trackingEvents] = useTrackingEvents();
  const nluManager = useFeature(Realtime.FeatureFlag.NLU_MANAGER);
  const goToNLUManagerEntity = useDispatch(Router.goToCurrentNLUManagerEntity);

  const domainID = useSelector(Session.activeDomainIDSelector);
  const versionID = useSelector(Session.activeVersionIDSelector);
  const diagramID = useSelector(CreatorV2.activeDiagramIDSelector);
  const projectID = useSelector(Session.activeProjectIDSelector);

  const isTraining = nlp.publishing || !!nlp.job;
  const isTrained = !isModelChanged(trainingState.diff) && (!nlp.job || nlp.job.stage.type === NLPTrainStageType.SUCCESS);

  const handleGoToIMM = (slotID: string) => {
    if (nluManager.isEnabled) {
      goToNLUManagerEntity(InteractionModelTabType.SLOTS, slotID);
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
      await nlp.publish();
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
    if (!isTraining) {
      getDiff();
    }
  }, [isTraining]);

  const api = {
    state: trainingState,
    startTraining,
    cancelTraining: nlp.cancel,
    getDiff,
    isTraining,
    isTrained,
  };

  return <TrainingModelContext.Provider value={api}>{children}</TrainingModelContext.Provider>;
};
