import { Nullish, Utils } from '@voiceflow/common';
import {
  DEFAULT_INTENT_CLASSIFICATION_LLM_SETTINGS,
  DEFAULT_INTENT_CLASSIFICATION_NLU_SETTINGS,
  IntentClassificationType,
} from '@voiceflow/dtos';
import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { StrengthGauge, usePersistFunction } from '@voiceflow/ui';
import { useCreateConst } from '@voiceflow/ui-next';
import React, { useEffect } from 'react';

import { Designer, Project, Version } from '@/ducks';
import { useDefaultAIModel, useIsAIFeaturesEnabled } from '@/hooks/ai.hook';
import { useFeature } from '@/hooks/feature.hook';
import { useIntentCreateModal, useIntentEditModal } from '@/hooks/modal.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { getIntentStrengthLevel, validateIntentName } from '@/utils/intent';
import { isIntentBuiltIn } from '@/utils/intent.util';

import { useActiveProjectTypeConfig } from './platformConfig';

export const useIsLLMIntentClassificationEnabled = () => {
  const aiFeaturesEnabled = useIsAIFeaturesEnabled();
  const intentClassification = useFeature(FeatureFlag.INTENT_CLASSIFICATION);

  const settings = useSelector(Version.selectors.active.intentClassificationSettings);
  const legacyIsLLMClassifier = useSelector(Project.active.isLLMClassifier);

  return intentClassification
    ? aiFeaturesEnabled && settings?.type === IntentClassificationType.LLM
    : legacyIsLLMClassifier;
};

export const useIntentDescriptionPlaceholder = () => {
  return useIsLLMIntentClassificationEnabled() ? 'Trigger this intent when…' : 'Enter description (optional)';
};

export const useIntentGetDefaultClassificationSettings = () => {
  const defaultAIModel = useDefaultAIModel();

  return (type: IntentClassificationType) => {
    if (type === IntentClassificationType.NLU) {
      return DEFAULT_INTENT_CLASSIFICATION_NLU_SETTINGS;
    }

    return {
      ...DEFAULT_INTENT_CLASSIFICATION_LLM_SETTINGS,
      params: { ...DEFAULT_INTENT_CLASSIFICATION_LLM_SETTINGS.params, model: defaultAIModel },
    };
  };
};

export const useIntentClassificationSettings = () => {
  const settings = useSelector(Version.selectors.active.intentClassificationSettings);
  const aiFeaturesEnabled = useIsAIFeaturesEnabled();
  const getDefaultSettings = useIntentGetDefaultClassificationSettings();
  const defaultNLUSettings = useCreateConst(() => getDefaultSettings(IntentClassificationType.NLU));

  const updateSettings = useDispatch(Version.effect.updateSettings);

  // if AI features are disabled, reset the settings to NLU
  const shouldResetToNLU = !aiFeaturesEnabled && settings.type === IntentClassificationType.LLM;

  useEffect(() => {
    if (shouldResetToNLU) {
      updateSettings({ intentClassification: defaultNLUSettings });
    }
  }, [shouldResetToNLU]);

  return shouldResetToNLU ? defaultNLUSettings : settings;
};

export const useOnOpenIntentCreateModal = () => {
  const intentCreateModal = useIntentCreateModal();

  return async (data: { name: string; folderID: string | null }) => {
    const entity = await intentCreateModal.open(data);

    return {
      ...entity,
      // TODO: remove when we fully migrate to the V3 components
      isVariable: false,
    };
  };
};

export const useIntent = (intentID: Nullish<string>) => {
  const intentEditModal = useIntentEditModal();

  const intent = useSelector(Designer.Intent.selectors.oneWithUtterances, { id: intentID });

  const intentIsBuiltIn = React.useMemo(() => !!intent && isIntentBuiltIn(intent.id), [intent?.id]);

  const [intentHasRequiredEntity, strengthLevel] = React.useMemo(() => {
    if (!intent) return [false, StrengthGauge.Level.NOT_SET];

    if (intent.entityOrder)
      return [
        !!intent.entityOrder.length,
        intentIsBuiltIn ? StrengthGauge.Level.VERY_STRONG : getIntentStrengthLevel(intent.utterances.length),
      ];

    return [intentIsBuiltIn ? StrengthGauge.Level.VERY_STRONG : getIntentStrengthLevel(intent.utterances.length)];
  }, [intent]);

  const shouldDisplayRequiredEntities = !!intent && !intentIsBuiltIn && intentHasRequiredEntity;

  return {
    intent,
    strengthLevel,
    intentIsBuiltIn,
    onOpenIntentEditModal: (data: { intentID: string }) => intentEditModal.openVoid(data),
    intentHasRequiredEntity,
    shouldDisplayRequiredEntities,
  };
};

export const useIntentNameProcessor = () => {
  const intents = useSelector(Designer.Intent.selectors.allWithFormattedBuiltInNames);
  const entities = useSelector(Designer.Entity.selectors.all);
  const platform = useSelector(Project.active.platformSelector);

  return usePersistFunction((name: string, intentID?: string) => {
    const formattedName = Utils.string.removeTrailingUnderscores(name);

    const filteredIntents = intentID
      ? Utils.array.inferUnion(intents).filter((intent) => intent.id !== intentID)
      : intents;

    const error = validateIntentName(formattedName, filteredIntents, entities, platform);

    return { error, formattedName };
  });
};

export const useAreIntentPromptsEmpty = (prompts?: unknown[]): boolean => {
  const projectTypeConfig = useActiveProjectTypeConfig();

  return React.useMemo(
    () =>
      !prompts ||
      prompts.every(
        (prompt) =>
          !projectTypeConfig.utils.intent.isPrompt(prompt) || projectTypeConfig.utils.intent.isPromptEmpty(prompt)
      ),
    [prompts, projectTypeConfig]
  );
};
