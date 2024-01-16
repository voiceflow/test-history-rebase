import dedent from 'dedent';
import { z } from 'nestjs-zod/z';

import { convertUtterances, parseArrayString } from '../generation.util';

export const getPromptPrompt = (quantity: number, utterances: string[], locale = 'en-US') => {
  const utteranceString = convertUtterances(utterances);
  return {
    prompt: dedent`
    Generate only 3 similar phrases to the following phrases: ["hi"]. Do so for locale "en-US" and format as a parsable JSON array <string[]>:
    ["hello", "hey", "greetings"]
    ###
    Generate only ${quantity} similar phrases to the following phrases: [${utteranceString}]. Do so for locale "${locale}" and format as a parsable JSON array <string[]>:`,

    // remove all new lines
    parser: (output: string) => parseArrayString(output?.replace(/\r\n|\r|\n/g, ''), z.array(z.string())),
  };
};
