import { AIParamsDTO } from '@voiceflow/dtos';
import { z } from 'nestjs-zod/z';

import { CompletionOptions } from '@/llm/llm-model.dto';

export const BaseCompletionRequest = z.object({
  projectID: z.string().optional(),
  workspaceID: z.string(),

  params: AIParamsDTO,

  options: CompletionOptions.optional(),

  billing: z.boolean().optional(),
  moderation: z.boolean().optional(),
});

export type BaseCompletionRequest = z.infer<typeof BaseCompletionRequest>;

export const CompletionRequest = BaseCompletionRequest.extend({
  prompt: z.string().min(1),
});

export type CompletionRequest = z.infer<typeof CompletionRequest>;
