import { z } from 'nestjs-zod/z';

import { BaseRequest } from './generate-prompt.request';

export const GenerateUtteranceRequest = BaseRequest.extend({
  intent: z.string().optional(),
  /**
   * utterances to generate, can include entities
   * @example ["hello {name}", "hi {name}"]
   */
  examples: z.array(z.string()).optional(),
});

export type GenerateUtteranceRequest = z.infer<typeof GenerateUtteranceRequest>;
