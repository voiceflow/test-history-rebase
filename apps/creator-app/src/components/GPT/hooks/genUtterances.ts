import { READABLE_VARIABLE_REGEXP } from '@voiceflow/common';
import type * as Platform from '@voiceflow/platform-config';
import { useTeardown } from '@voiceflow/ui';

import { mlGatewayClient } from '@/client/ml-gateway';
import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';
import { isDefaultIntentName } from '@/utils/intent';
import { slotToString, transformVariablesToReadable } from '@/utils/slot';

import type { GenApi } from './gen';
import { useGen } from './gen';

export const useGenUtterances = ({
  inputs,
  onAccept,
  disabled,
  intentName,
  onIntentNameSuggested,
}: {
  inputs: Platform.Base.Models.Intent.Input[];
  onAccept: (items: Platform.Base.Models.Intent.Input[]) => void;
  disabled?: boolean;
  intentName?: string | null;
  onIntentNameSuggested?: (newName: string) => void;
}): GenApi<Platform.Base.Models.Intent.Input> => {
  const entitiesMap = useSelector(Designer.Entity.selectors.map);
  const entitiesMapByName = useSelector(Designer.Entity.selectors.mapByName);

  const api = useGen<Platform.Base.Models.Intent.Input>({
    onAccept,
    disabled,
    examples: inputs,

    examplesToDB: (items) =>
      items.map((input) => transformVariablesToReadable(input.text, entitiesMap)).filter(Boolean),

    dbExamplesToTrack: (items) => items,

    generate: async (options) => {
      const isDefaultName = isDefaultIntentName(intentName);

      const { results, suggestedIntentName } = await mlGatewayClient.generation.generateUtterance({
        ...options,
        intent: (isDefaultName ? null : intentName) ?? '',
      });

      if (isDefaultName && suggestedIntentName) {
        onIntentNameSuggested?.(suggestedIntentName);
      }

      return results.map((result) => {
        const slots: string[] = [];

        const text = result.replace(READABLE_VARIABLE_REGEXP, (_, name) => {
          const slot = entitiesMapByName[name];

          if (slot) slots.push(slot.id);

          return slotToString(slot ?? { id: name, name });
        });

        return { text, slots };
      });
    },
  });

  useTeardown(() => {
    api.onAcceptAll();
  });

  return api;
};
