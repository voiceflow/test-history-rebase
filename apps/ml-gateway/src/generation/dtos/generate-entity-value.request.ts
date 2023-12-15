import { z } from 'nestjs-zod/z';

import { BaseRequest } from './generate-prompt.request';

export const GenerateEntityValueRequest = BaseRequest.extend({
  /**
   * type of the entity
   */
  type: z.string(),
  /**
   * name of the entity
   */
  name: z.string().optional(),
  /**
   * entity values and synonyms, first value is the value, others are synonyms
   * @example [["tesla", "model 3", "model y", "cybertrack"], ["world", "earth"]]
   */
  examples: z.array(z.array(z.string())).optional(),
});

export type GenerateEntityValueRequest = z.infer<typeof GenerateEntityValueRequest>;
