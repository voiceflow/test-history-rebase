import { AIMessageDTO } from '@voiceflow/dtos';
import { z } from 'nestjs-zod/z';

import { BaseCompletionRequest } from './completion.request';

export const ChatCompletionRequest = BaseCompletionRequest.extend({
  messages: z.array(AIMessageDTO),
});

export type ChatCompletionRequest = z.infer<typeof ChatCompletionRequest>;
