import { z } from 'nestjs-zod/z';

import { CompletionOutput } from '@/llm/llm-model.dto';

export const CompletionResponse = CompletionOutput.nullable();

export type CompletionResponse = z.infer<typeof CompletionResponse>;
