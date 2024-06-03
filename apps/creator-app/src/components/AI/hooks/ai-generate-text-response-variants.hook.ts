import type { AnyResponseVariant, AnyResponseVariantCreate } from '@voiceflow/dtos';
import { markupToString } from '@voiceflow/utils-designer';

import { mlGatewayClient } from '@/client/ml-gateway';
import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';
import { isTextResponseVariant } from '@/utils/response.util';

import type { AIGenerateTextResponseVariant } from '../ai.interface';
import { useAIGenerate } from './ai-generate.hook';

export interface IAIGenerateTextResponseVariants {
  examples: AnyResponseVariant[] | AnyResponseVariantCreate[];
  onGenerated: (items: AIGenerateTextResponseVariant[]) => void;
  generateBuiltIn?: (options: { quantity: number }) => Promise<string[]> | string[];
  successGeneratedMessage: string;
}

export const useAIGenerateTextResponseVariants = ({
  examples,
  onGenerated,
  generateBuiltIn,
  successGeneratedMessage,
}: IAIGenerateTextResponseVariants) => {
  const entitiesMapByID = useSelector(Designer.Entity.selectors.map);
  const variablesMapByID = useSelector(Designer.Variable.selectors.map);
  const entitiesMapByName = useSelector(Designer.Entity.selectors.mapByName);
  const variablesMapByName = useSelector(Designer.Variable.selectors.mapByName);

  return useAIGenerate<AnyResponseVariant | AnyResponseVariantCreate, AIGenerateTextResponseVariant>({
    examples,
    transform: (items) => items.filter(isTextResponseVariant),
    onGenerated,
    successGeneratedMessage,

    generate: async (options) => {
      let results: string[] = [];

      if (!options.examples.length && generateBuiltIn) {
        results = await generateBuiltIn({ quantity: options.quantity });
      } else {
        ({ results } = await mlGatewayClient.generation.generatePrompt({
          ...options,
          format: 'text',
          examples: options.examples
            .map(({ text }) => markupToString.fromDB(text, { entitiesMapByID, variablesMapByID }))
            .filter(Boolean),
        }));
      }

      return results.map((result) => ({
        text: markupToString.toDB(result, { entitiesMapByName, variablesMapByName }),
      }));
    },
  });
};
