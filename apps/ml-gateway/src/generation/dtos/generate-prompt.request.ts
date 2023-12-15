import { z } from 'nestjs-zod/z';

export const BaseRequest = z.object({
  locales: z.array(z.string()).optional(),
  quantity: z.number(),
  requestID: z.string(),
  workspaceID: z.string(),
});

export const GeneratePromptRequest = BaseRequest.extend({
  format: z.enum(['text', 'ssml', 'markdown']),
  examples: z.array(z.string()),
});

export type GeneratePromptRequest = z.infer<typeof GeneratePromptRequest>;
