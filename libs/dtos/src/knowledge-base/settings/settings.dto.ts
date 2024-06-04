import { z } from 'zod';

import { AIParamsDTO } from '@/ai/ai-params.dto';

import { KBSettingsChunkStrategy } from './settings-chunk-strategy.enum';
import { KBSettingsPromptMode } from './settings-prompt-mode.enum';

export const KnowledgeBaseSettingsDTO = z
  .object({
    summarization: AIParamsDTO.pick({
      model: true,
      system: true,
      temperature: true,
    })
      .required()
      .merge(AIParamsDTO.pick({ maxTokens: true }))
      .extend({
        mode: z.nativeEnum(KBSettingsPromptMode),
        prompt: z.string(),
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
  })
  .strict();

export type KnowledgeBaseSettings = z.infer<typeof KnowledgeBaseSettingsDTO>;
