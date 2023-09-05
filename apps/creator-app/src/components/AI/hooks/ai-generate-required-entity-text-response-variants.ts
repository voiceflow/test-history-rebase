import type { EntityWithVariants, TextResponseVariant, Utterance } from '@voiceflow/sdk-logux-designer';

import { gptGenClient } from '@/client/gptGen';
import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';
import { isDefaultIntentName } from '@/utils/intent.util';
import { markupToString } from '@/utils/markup.util';

import type { AIGenerateTextResponseVariant } from '../ai.interface';
import { useAIGenerate } from './ai-generate.hook';

export interface IAIGenerateRequiredEntityTextResponseVariants {
  entity: EntityWithVariants;
  examples: TextResponseVariant[];
  intentName: string;
  utterances: Utterance[];
  onGenerated: (items: AIGenerateTextResponseVariant[]) => void;
}

export const useAIGenerateRequiredEntityTextResponseVariants = ({
  entity,
  examples,
  intentName,
  utterances,
  onGenerated,
}: IAIGenerateRequiredEntityTextResponseVariants) => {
  const entitiesMapByID = useSelector(Designer.Entity.selectors.map);
  const entitiesMapByName = useSelector(Designer.Entity.selectors.mapByName);

  return useAIGenerate<AIGenerateTextResponseVariant>({
    examples,
    onGenerated,

    generate: async (options) => {
      const { results } = await gptGenClient.genEntityPrompts({
        ...options,
        type: entity.classifier ?? 'Custom',
        name: entity.name,
        examples: options.examples.map(({ text }) => markupToString.fromDB(text, { entitiesMapByID, variablesMapByID: {} })).filter(Boolean),
        intentName: isDefaultIntentName(intentName) ? '' : intentName,
        intentInputs: utterances.map(({ text }) => markupToString.fromDB(text, { entitiesMapByID, variablesMapByID: {} })),
      });

      return results.map((result) => ({
        text: markupToString.toDB(result, { entitiesMapByName, variablesMapByName: {} }),
      }));
    },
  });
};
