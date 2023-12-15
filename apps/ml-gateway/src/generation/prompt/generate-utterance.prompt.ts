import { z } from 'nestjs-zod/z';

import { convertUtterances, parseObjectString } from '../generation.util';

export const getUtterancePrompt = ({
  quantity,
  intentName,
  examples,
  locale = 'en-US',
}: {
  intentName?: string;
  examples?: string[];
  quantity: number;
  locale?: string;
}) => {
  const utterances = convertUtterances(examples || []);
  const parser = (output: string) =>
    parseObjectString(
      output,
      z.object({
        utterances: z.array(z.string()),
        intent_name: z.string().optional(),
      })
    );

  if (intentName && utterances)
    return {
      prompt: `For the intent name "${intentName}", generate ${quantity} more utterances in a list in locale "${locale}" using the following utterances as examples: ${utterances}. Format the generated utterances as a JSON array within a valid JSON object with the key "utterances", like this { utterances: string [] }.`,
      parser,
    };

  if (!intentName && utterances)
    return {
      prompt: `Generate one intent name with the following utterance examples: ${utterances}. Now use that intent name to generate ${quantity} more utterances in locale "${locale}". Format as a valid JSON object with keys "intent_name" and "utterances", like this { intent_name: string, utterances: string [] }.`,
      parser,
    };

  if (intentName)
    return {
      prompt: `Generate ${quantity} utterances in a list for the intent name "${intentName}" in locale "${locale}". Format the generated utterances as a JSON array within a valid JSON object with the key "utterances", like this { utterances: string [] }.`,
      parser,
    };

  throw new Error('No intent name or utterances provided.');
};
