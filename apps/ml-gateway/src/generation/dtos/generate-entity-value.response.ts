import { z } from 'nestjs-zod/z';

export const GenerateEntityValueResponse = z.object({
  /**
   * entity values and synonyms, first value is the value, others are synonyms
   * @example [["hello", "hi"], ["world", "earth"]]
   */
  results: z.array(z.array(z.string())),
});

export type GenerateEntityValueResponse = z.infer<typeof GenerateEntityValueResponse>;
