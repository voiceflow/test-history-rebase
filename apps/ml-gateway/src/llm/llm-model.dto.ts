import { z } from 'nestjs-zod/z';

export const CompletionOutput = z
  .object({
    output: z.string().nullable(),
    tokens: z.number(),
    queryTokens: z.number(),
    answerTokens: z.number(),
  })
  .nullable();

export type CompletionOutput = z.infer<typeof CompletionOutput>;

export const CompletionOptions = z
  .object({
    timeout: z.number(),
    retries: z.number(),
    retryDelay: z.number(),
  })
  .partial();

export type CompletionOptions = z.infer<typeof CompletionOptions>;
