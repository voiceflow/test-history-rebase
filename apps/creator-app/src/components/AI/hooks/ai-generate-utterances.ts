import type { Utterance } from '@voiceflow/dtos';
import { Language } from '@voiceflow/dtos';

import { gptGenClient } from '@/client/gptGen';
import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';
import { isDefaultIntentName } from '@/utils/intent.util';
import { utteranceTextToString } from '@/utils/utterance.util';

import type { AIGenerateUtterance } from '../ai.interface';
import { useAIGenerate } from './ai-generate.hook';

interface IAIGenerateUtterances {
  examples: Pick<Utterance, 'text'>[];
  intentName: string;
  onGenerated: (items: AIGenerateUtterance[]) => void;
  onIntentNameSuggested?: (suggestedIntentName: string) => void;
}

export const useAIGenerateUtterances = ({ examples, intentName, onGenerated, onIntentNameSuggested }: IAIGenerateUtterances) => {
  const entitiesMapByID = useSelector(Designer.Entity.selectors.map);
  const entitiesMapByName = useSelector(Designer.Entity.selectors.mapByName);

  return useAIGenerate<AIGenerateUtterance>({
    examples,
    onGenerated,

    generate: async (options) => {
      const isDefaultName = isDefaultIntentName(intentName);

      const { results, suggestedIntentName } = await gptGenClient.genUtterances({
        ...options,
        intent: isDefaultName ? '' : intentName ?? '',
        locales: [Language.ENGLISH_US],
        examples: options.examples.map(({ text }) => utteranceTextToString.fromDB(text, { entitiesMapByID })),
      });

      if (isDefaultName && suggestedIntentName) {
        onIntentNameSuggested?.(suggestedIntentName);
      }

      return results.map((result) => ({
        text: utteranceTextToString.toDB(result, { entitiesMapByName }),
      }));
    },
  });
};
