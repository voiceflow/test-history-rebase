import { type EntityVariant, Language } from '@voiceflow/dtos';

import { gptGenClient } from '@/client/gptGen';
import { isDefaultEntityName } from '@/utils/entity.util';

import type { AIGenerateEntityVariant } from '../ai.interface';
import { useAIGenerate } from './ai-generate.hook';

export interface IAIGenerateEntityVariants {
  examples: Pick<EntityVariant, 'value' | 'synonyms'>[];
  entityType?: string | null;
  entityName?: string | null;
  onGenerated: (variants: AIGenerateEntityVariant[]) => void;
}

export const useAIGenerateEntityVariants = ({ examples, entityName, entityType, onGenerated }: IAIGenerateEntityVariants) => {
  return useAIGenerate<AIGenerateEntityVariant>({
    examples,
    onGenerated,

    generate: async (options) => {
      const { results } = await gptGenClient.genEntityValues({
        ...options,
        name: isDefaultEntityName(entityName) ? '' : entityName ?? '',
        // TODO: use enum or const
        type: entityType || 'custom',
        locales: [Language.ENGLISH_US],
        examples: options.examples.map(({ value, synonyms }) => [value, ...synonyms]).filter((arr) => arr.every(Boolean)),
      });

      return results.map(([value, ...synonyms]) => ({ value, synonyms }));
    },
  });
};
