import type { Entity, Utterance } from '@voiceflow/dtos';
import { isDefaultIntentName, markupToString } from '@voiceflow/utils-designer';

import { gptGenClient } from '@/client/gptGen';
import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';

import type { AIGenerateTextResponseVariant } from '../ai.interface';
import { useAIGenerate } from './ai-generate.hook';

export interface IAIGenerateRequiredEntityTextResponseVariants {
  entity: Entity | null;
  examples: AIGenerateTextResponseVariant[];
  intentName: string;
  utterances: Pick<Utterance, 'text'>[];
  onGenerated: (items: AIGenerateTextResponseVariant[]) => void;
  successGeneratedMessage: string;
}

export const useAIGenerateRequiredEntityTextResponseVariants = ({
  entity,
  examples,
  intentName,
  utterances,
  onGenerated,
  successGeneratedMessage,
}: IAIGenerateRequiredEntityTextResponseVariants) => {
  const entitiesMapByID = useSelector(Designer.Entity.selectors.map);
  const entitiesMapByName = useSelector(Designer.Entity.selectors.mapByName);

  return useAIGenerate<AIGenerateTextResponseVariant>({
    examples,
    onGenerated,
    successGeneratedMessage,

    generate: async (options) => {
      const { results } = await gptGenClient.genEntityPrompts({
        ...options,
        type: entity?.classifier ?? 'Custom',
        name: entity?.name ?? '',
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
