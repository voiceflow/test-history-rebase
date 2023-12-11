import type { Utterance } from '@voiceflow/dtos';
import { Language } from '@voiceflow/dtos';
import { toast } from '@voiceflow/ui-next';
import { isDefaultIntentName } from '@voiceflow/utils-designer';

import { gptGenClient } from '@/client/gptGen';
import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';
import { utteranceTextToString } from '@/utils/utterance.util';

import type { AIGenerateUtterance } from '../ai.interface';
import { useAIGenerate } from './ai-generate.hook';

interface IAIGenerateUtterances {
  examples: Pick<Utterance, 'text'>[];
  intentName: string;
  onGenerated: (items: AIGenerateUtterance[]) => void;
  onIntentNameSuggested?: (suggestedIntentName: string) => void;
  successGeneratedMessage: string;
}

export const useAIGenerateUtterances = ({
  examples,
  intentName,
  onGenerated,
  onIntentNameSuggested,
  successGeneratedMessage,
}: IAIGenerateUtterances) => {
  const entitiesMapByID = useSelector(Designer.Entity.selectors.map);
  const entitiesMapByName = useSelector(Designer.Entity.selectors.mapByName);

  return useAIGenerate<AIGenerateUtterance>({
    examples,
    onGenerated,
    successGeneratedMessage,

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

      toast.success('Utterances generated');

      return results.map((result) => ({
        text: utteranceTextToString.toDB(result, { entitiesMapByName }),
      }));
    },
  });
};
