import dedent from 'dedent';
import { z } from 'nestjs-zod/z';

import { convertUtterances, parseArrayString } from '../generation.util';

export const getPromptPrompt = (quantity: number, utterances: string[], locale = 'en-US') => ({
  prompt: dedent`Generate only ${quantity} similar phrases to the following phrases: [${convertUtterances(
    utterances
  )}]. Do so for locale "${locale}" and format as a parsable JSON array: string[].`,
  parser: (output: string) => parseArrayString(output, z.array(z.string())),
});
