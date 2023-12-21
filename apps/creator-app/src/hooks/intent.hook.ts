import { Nullish, Utils } from '@voiceflow/common';
import { StrengthGauge, usePersistFunction } from '@voiceflow/ui';
import _sortBy from 'lodash/sortBy';
import React from 'react';

import { Designer, Intent as IntentDuck } from '@/ducks';
import * as ProjectV2 from '@/ducks/projectV2';
import { IDSelectorParam } from '@/ducks/utils/crudV2';
import { useIntentCreateModalV2, useIntentEditModalV2 } from '@/hooks/modal.hook';
import { getIntentStrengthLevel, validateIntentName } from '@/utils/intent';
import { isIntentBuiltIn } from '@/utils/intent.util';

import { useAllEntitiesSelector } from './entity.hook';
import { useActiveProjectTypeConfig } from './platformConfig';
import { useSelector } from './redux';

export const useIntentMapSelector = () => useSelector(Designer.Intent.selectors.mapWithFormattedBuiltInName);
export const useAllIntentsSelector = () => useSelector(Designer.Intent.selectors.allWithFormattedBuiltInNames);
export const useAllCustomIntentsSelector = () => useSelector(Designer.Intent.selectors.allWithFormattedBuiltInNames);
export const useCustomIntentMapSelector = () => useSelector(Designer.Intent.selectors.mapWithFormattedBuiltInName);
export const useAllPlatformIntentsSelector = () => useSelector(Designer.Intent.selectors.allWithFormattedBuiltInNames);

export const useOneIntentByIDSelector = (params: IDSelectorParam) => useSelector(Designer.Intent.selectors.oneWithFormattedBuiltNameByID, params);

export const useOnePlatformIntentByIDSelector = (params: IDSelectorParam) =>
  useSelector(Designer.Intent.selectors.oneWithFormattedBuiltNameByID, params);

export const useOnePlatformIntentWithUtterancesByIDSelector = (params: IDSelectorParam) =>
  useSelector(Designer.Intent.selectors.oneWithUtterances, params);

export const useGetOnePlatformIntentByIDSelector = () => useSelector(Designer.Intent.selectors.getOneWithFormattedBuiltNameByID);

export const useGetOnePlatformIntentWithUtterancesByIDSelector = () => useSelector(Designer.Intent.selectors.getOneWithUtterances);

export const useAllIntentsWithUtterancesSelector = () => useSelector(Designer.Intent.selectors.allWithUtterances);

export const useOnOpenIntentCreateModal = () => {
  const intentCreateModal = useIntentCreateModalV2();

  return async (data: { name: string; folderID: string | null }) => {
    const entity = await intentCreateModal.open(data);

    return {
      ...entity,
      // TODO: remove when we fully migrate to the V3 components
      isVariable: false,
    };
  };
};

export const useOnOpenIntentEditModal = () => {
  const intentEditModal = useIntentEditModalV2();
  return (data: { intentID: string }) => intentEditModal.openVoid(data);
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

  const intentIsBuiltIn = React.useMemo(() => !!intent && isIntentBuiltIn(intent.id), [intent?.id]);

  const [intentHasRequiredEntity, strengthLevel] = React.useMemo(() => {
    if (!intent) return [false, StrengthGauge.Level.NOT_SET];

    if (intent.entityOrder)
      return [!!intent.entityOrder.length, intentIsBuiltIn ? StrengthGauge.Level.VERY_STRONG : getIntentStrengthLevel(intent.utterances.length)];

    return [intentIsBuiltIn ? StrengthGauge.Level.VERY_STRONG : getIntentStrengthLevel(intent.utterances.length)];
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
