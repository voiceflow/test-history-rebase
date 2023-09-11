import type { AnyResponseVariant } from '@voiceflow/sdk-logux-designer';
import { Language } from '@voiceflow/sdk-logux-designer';

import { gptGenClient } from '@/client/gptGen';
import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';
import { markupToString } from '@/utils/markup.util';
import { isTextResponseVariant } from '@/utils/response.util';

import type { AIGenerateTextResponseVariant } from '../ai.interface';
import { useAIGenerate } from './ai-generate.hook';

export interface IAIGenerateTextResponseVariants {
  examples: AnyResponseVariant[];
  onGenerated: (items: AIGenerateTextResponseVariant[]) => void;
  generateBuiltIn?: (options: { quantity: number }) => Promise<string[]> | string[];
}

export const useAIGenerateTextResponseVariants = ({ examples, onGenerated, generateBuiltIn }: IAIGenerateTextResponseVariants) => {
  const entitiesMapByID = useSelector(Designer.Entity.selectors.map);
  const variablesMapByID = useSelector(Designer.Variable.selectors.map);
  const entitiesMapByName = useSelector(Designer.Entity.selectors.mapByName);
  const variablesMapByName = useSelector(Designer.Variable.selectors.mapByName);

  return useAIGenerate<AnyResponseVariant, AIGenerateTextResponseVariant>({
    examples,
    transform: (items) => items.filter(isTextResponseVariant),
    onGenerated,

    generate: async (options) => {
      let results: string[] = [];

      if (!options.examples.length && generateBuiltIn) {
        results = await generateBuiltIn({ quantity: options.quantity });
      } else {
        ({ results } = await gptGenClient.genPrompts({
          ...options,
          format: 'text',
          locales: [Language.ENGLISH_US],
          examples: options.examples.map(({ text }) => markupToString.fromDB(text, { entitiesMapByID, variablesMapByID })).filter(Boolean),
        }));
      }

      return results.map((result) => ({
        text: markupToString.toDB(result, { entitiesMapByName, variablesMapByName }),
      }));
    },
  });
};
