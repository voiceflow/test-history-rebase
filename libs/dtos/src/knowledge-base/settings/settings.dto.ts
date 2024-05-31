import { z } from 'zod';

import { AIModel } from '../../ai/ai-model.enum';
import { KBSettingsChunkStrategy } from './settings-chunk-strategy.enum';
import { KBSettingsPromptMode } from './settings-prompt-mode.enum';

export const KnowledgeBaseSettingsDTO = z.object({
  summarization: z.object({
    prompt: z.string(),
    mode: z.nativeEnum(KBSettingsPromptMode),
    model: z.nativeEnum(AIModel),
    temperature: z.number(),
    system: z.string(),
    maxTokens: z.number().optional(),
  }),
  chunkStrategy: z.object({
    type: z.nativeEnum(KBSettingsChunkStrategy),
    size: z.number(),
    overlap: z.number(),
  }),
  search: z.object({
    limit: z.number(),
    metric: z.string(),
  }),
});

export type KnowledgeBaseSettings = z.infer<typeof KnowledgeBaseSettingsDTO>;
