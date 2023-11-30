import { CUSTOM_SLOT_TYPE } from '@voiceflow/common';
import { type EntityVariant, Language } from '@voiceflow/dtos';
import { toast } from '@voiceflow/ui-next';
import { isDefaultEntityName } from '@voiceflow/utils-designer';

import { gptGenClient } from '@/client/gptGen';

import type { AIGenerateEntityVariant } from '../ai.interface';
import { useAIGenerate } from './ai-generate.hook';

export interface IAIGenerateEntityVariants {
  examples: Pick<EntityVariant, 'value' | 'synonyms'>[];
  entityName?: string | null;
  onGenerated: (variants: AIGenerateEntityVariant[]) => void;
  entityClassifier?: string | null;
}

export const useAIGenerateEntityVariants = ({ examples, entityName, onGenerated, entityClassifier }: IAIGenerateEntityVariants) => {
  return useAIGenerate<AIGenerateEntityVariant>({
    examples,
    onGenerated,

    generate: async (options) => {
      const { results } = await gptGenClient.genEntityValues({
        ...options,
        name: isDefaultEntityName(entityName) ? '' : entityName ?? '',
        type: entityClassifier || CUSTOM_SLOT_TYPE,
        locales: [Language.ENGLISH_US],
        examples: options.examples.map(({ value, synonyms }) => [value, ...synonyms]).filter((arr) => arr.every(Boolean)),
      });

      toast.success('Values generated');

      return results.map(([value, ...synonyms]) => ({ value, synonyms }));
    },
  });
};
