import { Nullable, Nullish, Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import { usePersistFunction } from '@voiceflow/ui';
import _sortBy from 'lodash/sortBy';
import * as Normal from 'normal-store';
import React from 'react';

import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import { useEditIntentModal } from '@/ModalsV2/hooks';
import { isBuiltInIntent, validateIntentName } from '@/utils/intent';

import { useAllEntitiesSelector } from './entity.hook';
import { useActiveProjectTypeConfig } from './platformConfig';
import { useSelector } from './redux';

interface IntentData {
  intent: Nullable<Platform.Base.Models.Intent.Model>;
  editIntentModal: ReturnType<typeof useEditIntentModal>;
  intentIsBuiltIn: boolean;
  intentHasRequiredEntity: boolean;
  shouldDisplayRequiredEntities: boolean;
}

export const useOrderedIntents = () => {
  const allIntents = useSelector(IntentV2.allCustomIntentsSelector);

  return React.useMemo(() => _sortBy(allIntents, (intent) => intent.name.toLowerCase()), [allIntents]);
};

export const useIntent = (intentID: Nullish<string>): IntentData => {
  const editIntentModal = useEditIntentModal();

  const intent = useSelector(IntentV2.platformIntentByIDSelector, { id: intentID });

  const intentIsBuiltIn = React.useMemo(() => !!intent && isBuiltInIntent(intent.id), [intent?.id]);

  const intentHasRequiredEntity = React.useMemo(
    () => !!intent?.slots && Normal.denormalize(intent.slots).some((entity) => entity.required),
    [intent?.slots]
  );

  const shouldDisplayRequiredEntities = !!intent && !intentIsBuiltIn && intentHasRequiredEntity;

  return {
    intent,
    editIntentModal,
    intentIsBuiltIn,
    intentHasRequiredEntity,
    shouldDisplayRequiredEntities,
  };
};

interface IntentNameProcessor {
  (name: string, intentID?: string): { error: null | string; formattedName: string };
}

export const useIntentNameProcessor = (): IntentNameProcessor => {
  const intents = useSelector(IntentV2.allIntentsSelector);
  const entities = useAllEntitiesSelector();
  const platform = useSelector(ProjectV2.active.platformSelector);

  return usePersistFunction((name: string, intentID?: string) => {
    const formattedName = Utils.string.removeTrailingUnderscores(name);

    const error = validateIntentName(formattedName, intentID ? intents.filter((intent) => intent.id !== intentID) : intents, entities, platform);

    return { error, formattedName };
  });
};

export const useAreIntentInputsEmpty = (inputs?: Platform.Base.Models.Intent.Input[]): boolean => {
  return React.useMemo(() => !inputs || inputs.every((input) => !input.text.trim()), [inputs]);
};

export const useAreIntentPromptsEmpty = (prompts?: unknown[]): boolean => {
  const projectTypeConfig = useActiveProjectTypeConfig();

  return React.useMemo(
    () =>
      !prompts || prompts.every((prompt) => !projectTypeConfig.utils.intent.isPrompt(prompt) || projectTypeConfig.utils.intent.isPromptEmpty(prompt)),
    [prompts, projectTypeConfig]
  );
};
