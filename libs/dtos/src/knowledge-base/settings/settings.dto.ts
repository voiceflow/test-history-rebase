import { z } from 'zod';

import { KBSettingsChunkStrategy } from './settings-chunk-strategy.enum';
import { KBSettingsGptModel } from './settings-gpt-model.enum';
import { KBSettingsPromptMode } from './settings-prompt-mode.enum';

export const KnowledgeBaseSettingsDTO = z.object({
  summarization: z.object({
    prompt: z.string(),
    mode: z.nativeEnum(KBSettingsPromptMode),
    model: z.nativeEnum(KBSettingsGptModel),
    temperature: z.number(),
    system: z.string(),
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
