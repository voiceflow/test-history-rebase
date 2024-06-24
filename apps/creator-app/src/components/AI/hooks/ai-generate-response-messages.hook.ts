import type { ResponseMessage, ResponseMessageCreate } from '@voiceflow/dtos';
import { markupToString } from '@voiceflow/utils-designer';

import { mlGatewayClient } from '@/client/ml-gateway';
import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';

import type { AIGenerateResponseMessage } from '../ai.interface';
import { useAIGenerate } from './ai-generate.hook';

export interface IAIGenerateResponseMessages {
  examples: ResponseMessage[] | ResponseMessageCreate[];
  onGenerated: (items: AIGenerateResponseMessage[]) => void;
  generateBuiltIn?: (options: { quantity: number }) => Promise<string[]> | string[];
  successGeneratedMessage: string;
}

export const useAIGenerateResponseMessages = ({
  examples,
  onGenerated,
  generateBuiltIn,
  successGeneratedMessage,
}: IAIGenerateResponseMessages) => {
  const entitiesMapByID = useSelector(Designer.Entity.selectors.map);
  const variablesMapByID = useSelector(Designer.Variable.selectors.map);
  const entitiesMapByName = useSelector(Designer.Entity.selectors.mapByName);
  const variablesMapByName = useSelector(Designer.Variable.selectors.mapByName);

  return useAIGenerate<ResponseMessage | ResponseMessageCreate, AIGenerateResponseMessage>({
    examples,
    onGenerated,
    successGeneratedMessage,
    transform: (items) => items,

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
