import { BaseModels, BaseUtils } from '@voiceflow/base-types';
import { z } from 'zod';

import type { Enum } from '@/utils/type/enum.util';

export const ChunkStrategyType = {
  RECURSIVE_TEXT_SPLITTER: 'recursive_text_splitter',
} as const;
export type KnowledgeBaseChunkStrategyType = Enum<typeof ChunkStrategyType>;

export const KnowledgeBaseSettingsDTO = z.object({
  summarization: z.object({
    prompt: z.string(),
    mode: z.nativeEnum(BaseUtils.ai.PROMPT_MODE),
    model: z.nativeEnum(BaseUtils.ai.GPT_MODEL),
    temperature: z.number(),
    system: z.string(),
  }),
  chunkStrategy: z.object({
    type: z.nativeEnum(BaseModels.Project.ChunkStrategyType),
    size: z.number(),
    overlap: z.number(),
  }),
  search: z.object({
    limit: z.number(),
    metric: z.string(),
  }),
});

export type KnowledgeBaseSettings = z.infer<typeof KnowledgeBaseSettingsDTO>;

export type KnowledgeBaseSettingsResponse = z.infer<typeof KnowledgeBaseSettingsDTO>;
