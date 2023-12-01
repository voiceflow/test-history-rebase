import { Nullish, Utils } from '@voiceflow/common';
import { Intent } from '@voiceflow/dtos';
import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { StrengthGauge, usePersistFunction } from '@voiceflow/ui';
import { intentDescriptionValidator, intentNameValidator, intentUtterancesValidator } from '@voiceflow/utils-designer';
import _sortBy from 'lodash/sortBy';
import * as Normal from 'normal-store';
import React from 'react';

import { Designer, Intent as IntentDuck } from '@/ducks';
import * as ProjectV2 from '@/ducks/projectV2';
import { useCreateIntentModal, useEditIntentModal, useIntentCreateModalV2, useIntentEditModalV2 } from '@/hooks/modal.hook';
import { getIntentStrengthLevel, isBuiltInIntent, validateIntentName } from '@/utils/intent';
import { utteranceTextFactory } from '@/utils/utterance.util';

import { useAllEntitiesSelector } from './entity.hook';
import { createUseFeatureSelector, useFeature } from './feature';
import { useActiveProjectTypeConfig } from './platformConfig';
import { useSelector } from './redux';
import { useStateWithKey } from './state.hook';
import { useDispatch, useGetValueSelector } from './store.hook';
import { useValidators } from './validate.hook';

export const useIntentMapSelector = createUseFeatureSelector(FeatureFlag.V2_CMS)(IntentDuck.intentsMapSelector, Designer.Intent.selectors.map);

export const useAllIntentsSelector = createUseFeatureSelector(FeatureFlag.V2_CMS)(IntentDuck.allIntentsSelector, Designer.Intent.selectors.all);

/**
 * @deprecated use useAllIntentsSelector instead when CMS V2 is enabled
 */
export const useAllCustomIntentsSelector = createUseFeatureSelector(FeatureFlag.V2_CMS)(
  IntentDuck.allCustomIntentsSelector,
  Designer.Intent.selectors.all
);

/**
 * @deprecated use useIntentMapSelector instead when CMS V2 is enabled
 */
export const useCustomIntentMapSelector = createUseFeatureSelector(FeatureFlag.V2_CMS)(
  IntentDuck.customIntentMapSelector,
  Designer.Intent.selectors.map
);

/**
 * @deprecated use useIntentMapSelector instead when CMS V2 is enabled
 */
export const useAllPlatformIntentsSelector = createUseFeatureSelector(FeatureFlag.V2_CMS)(
  IntentDuck.allPlatformIntentsSelector,
  Designer.Intent.selectors.all
);

export const useOneIntentByIDSelector = createUseFeatureSelector(FeatureFlag.V2_CMS)(
  IntentDuck.intentByIDSelector,
  Designer.Intent.selectors.oneByID
);

/**
 * @deprecated use useOneIntentByIDSelector instead when CMS V2 is enabled
 */
export const useOnePlatformIntentByIDSelector = createUseFeatureSelector(FeatureFlag.V2_CMS)(
  IntentDuck.platformIntentByIDSelector,
  Designer.Intent.selectors.oneByID
);

/**
 * @deprecated use useOneIntentWithUtterancesByIDSelector instead when CMS V2 is enabled
 */
export const useOnePlatformIntentWithUtterancesByIDSelector = createUseFeatureSelector(FeatureFlag.V2_CMS)(
  IntentDuck.platformIntentByIDSelector,
  Designer.Intent.selectors.oneWithUtterances
);

/**
 * @deprecated use useGetOneIntentByIDSelector instead when CMS V2 is enabled
 */
export const useGetOnePlatformIntentByIDSelector = createUseFeatureSelector(FeatureFlag.V2_CMS)(
  IntentDuck.getPlatformIntentByIDSelector,
  Designer.Intent.selectors.getOneByID
);

/**
 * @deprecated use useGetOneIntentWithUtterancesByIDSelector instead when CMS V2 is enabled
 */
export const useGetOnePlatformIntentWithUtterancesByIDSelector = createUseFeatureSelector(FeatureFlag.V2_CMS)(
  IntentDuck.getPlatformIntentByIDSelector,
  Designer.Intent.selectors.getOneWithUtterances
);

export const useAllIntentsWithUtterancesSelector = createUseFeatureSelector(FeatureFlag.V2_CMS)(
  IntentDuck.allIntentsSelector,
  Designer.Intent.selectors.allWithUtterances
);

export const useOnOpenIntentCreateModal = () => {
  const cmsV2 = useFeature(FeatureFlag.V2_CMS);
  const intentCreateModal = useIntentCreateModalV2();
  const legacyCreateIntentModal = useCreateIntentModal();

  return async (data: { name: string; folderID: string | null }) => {
    if (cmsV2.isEnabled) {
      const entity = await intentCreateModal.open(data);

      return {
        ...entity,
        // TODO: remove when we fully migrate to the V3 components
        isVariable: false,
      };
    }

    return legacyCreateIntentModal.open(data);
  };
};

export const useOnOpenIntentEditModal = () => {
  const cmsV2 = useFeature(FeatureFlag.V2_CMS);
  const intentEditModal = useIntentEditModalV2();
  const legacyEditIntentModal = useEditIntentModal();

  return (data: { intentID: string }) => {
    if (cmsV2.isEnabled) return intentEditModal.openVoid(data);

    return legacyEditIntentModal.openVoid(data);
  };
};

export const useOrderedIntents = () => {
  const allIntents = useAllCustomIntentsSelector();

  return React.useMemo(() => _sortBy(Utils.array.inferUnion(allIntents), (intent) => intent.name.toLowerCase()), [allIntents]);
};

export const useLegacyOrderedIntents = () => {
  const allIntents = useSelector(IntentDuck.allCustomIntentsSelector);

  return React.useMemo(() => _sortBy(Utils.array.inferUnion(allIntents), (intent) => intent.name.toLowerCase()), [allIntents]);
};

export const useIntent = (intentID: Nullish<string>) => {
  const onOpenIntentEditModal = useOnOpenIntentEditModal();

  const intent = useOnePlatformIntentWithUtterancesByIDSelector({ id: intentID });

  const intentIsBuiltIn = React.useMemo(() => !!intent && isBuiltInIntent(intent.id), [intent?.id]);

  const [intentHasRequiredEntity, strengthLevel] = React.useMemo(() => {
    if (!intent) return [false, StrengthGauge.Level.NOT_SET];

    if ('entityOrder' in intent)
      return [!!intent.entityOrder.length, intentIsBuiltIn ? StrengthGauge.Level.VERY_STRONG : getIntentStrengthLevel(intent.utterances.length)];

    return [
      !!intent.slots && Normal.denormalize(intent.slots).some((entity) => entity.required),
      intentIsBuiltIn ? StrengthGauge.Level.VERY_STRONG : getIntentStrengthLevel(intent.inputs.length),
    ];
  }, [intent]);

  const shouldDisplayRequiredEntities = !!intent && !intentIsBuiltIn && intentHasRequiredEntity;

  return {
    intent,
    strengthLevel,
    intentIsBuiltIn,
    onOpenIntentEditModal,
    intentHasRequiredEntity,
    shouldDisplayRequiredEntities,
  };
};

export const useIntentNameProcessor = () => {
  const intents = useAllIntentsSelector();
  const entities = useAllEntitiesSelector();
  const platform = useSelector(ProjectV2.active.platformSelector);

  return usePersistFunction((name: string, intentID?: string) => {
    const formattedName = Utils.string.removeTrailingUnderscores(name);

    const filteredIntents = intentID ? Utils.array.inferUnion(intents).filter((intent) => intent.id !== intentID) : intents;

    const error = validateIntentName(formattedName, filteredIntents, entities, platform);

    return { error, formattedName };
  });
};

export const useAreIntentPromptsEmpty = (prompts?: unknown[]): boolean => {
  const projectTypeConfig = useActiveProjectTypeConfig();

  return React.useMemo(
    () =>
      !prompts || prompts.every((prompt) => !projectTypeConfig.utils.intent.isPrompt(prompt) || projectTypeConfig.utils.intent.isPromptEmpty(prompt)),
    [prompts, projectTypeConfig]
  );
};

export const useEditIntentValidator = (intent: Intent | null) => {
  const createManyUtterances = useDispatch(Designer.Intent.Utterance.effect.createMany);

  const getIntents = useGetValueSelector(Designer.Intent.selectors.all);
  const getEntities = useGetValueSelector(Designer.Entity.selectors.all);
  const getVariables = useGetValueSelector(Designer.Variable.selectors.all);
  const getUtterances = useGetValueSelector(Designer.Intent.Utterance.selectors.allByIntentID, { intentID: intent?.id ?? null });

  const [nameError, nameErrorKey, setNameError] = useStateWithKey<string | null>(null);
  const [utterancesError, utterancesErrorKey, setUtterancesError] = useStateWithKey<string | null>(null);
  const [descriptionError, descriptionErrorKey, setDescriptionError] = useStateWithKey<string | null>(null);

  const validator = useValidators({
    name: [intentNameValidator, setNameError],
    utterances: [intentUtterancesValidator, setUtterancesError],
    description: [intentDescriptionValidator, setDescriptionError],
  });

  const validate = (intent: Intent, { validateOnly }: { validateOnly?: boolean } = {}) => {
    const utterances = getUtterances();

    const result = validator.validate(
      { name: intent.name, utterances, description: intent.description ?? '' },
      {
        intents: getIntents(),
        entities: getEntities(),
        intentID: intent.id,
        variables: getVariables(),
        validateOnly,
        isBuiltInIntent: isBuiltInIntent(intent.id),
      }
    );

    // needs at least one utterance to show the error on ui
    if (!validateOnly && !result.success && result.errors.utterances && !utterances.length) {
      createManyUtterances(intent.id, [{ text: utteranceTextFactory() }]);
    }

    return result;
  };

  return {
    isValid: () => !intent || validate(intent).success,
    validate,
    nameError,
    nameErrorKey,
    setNameError,
    resetNameError: () => setNameError(null),
    utterancesError,
    descriptionError,
    utterancesErrorKey,
    setUtterancesError,
    descriptionErrorKey,
    setDescriptionError,
    resetUtterancesError: () => setUtterancesError(null),
    resetDescriptionError: () => setDescriptionError(null),
  };
};
