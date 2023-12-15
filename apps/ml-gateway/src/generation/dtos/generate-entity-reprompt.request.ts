import { z } from 'nestjs-zod/z';

import { BaseRequest } from './generate-prompt.request';

export const GenerateEntityRepromptRequest = BaseRequest.extend({
  /**
   * type of the entity
   * voiceflow built-in types or "custom"
   */
  type: z.string().optional(),

  /**
   * name of the entity
   */
  name: z.string().optional(),

  /**
   * entity prompts
   * can be empty an array
   */
  examples: z.array(z.string()).optional(),

  /**
   * name of the intent that uses this entity
   */
  intentName: z.string().optional(),

  /**
   * intent's utterances
   */
  intentInputs: z.array(z.string()).optional(),
});

export type GenerateEntityRepromptRequest = z.infer<typeof GenerateEntityRepromptRequest>;
