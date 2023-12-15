import { z } from 'nestjs-zod/z';

import { convertUtterances, parseObjectString } from '../generation.util';

export const getEntityPromptPrompt = ({
  quantity,
  entityName,
  examples,
  intentName,
  locale = 'en-US',
}: {
  locale?: string;
  entityName?: string;
  examples?: string[];
  intentName?: string;
  quantity: number;
}) => {
  const utterances = convertUtterances(examples || []);
  const parser = (output: string) => parseObjectString(output, z.object({ eg: z.array(z.string()) }));

  if (intentName && entityName)
    return {
      prompt: `Given the intent "${intentName}" for locale "${locale}" generate ${quantity} ways to ask someone clarification if they are missing their "${entityName}". List the ${quantity}  clarifications within a JSON array that is nested within a valid JSON object with a key "eg", like this { eg: string[] }.`,
      parser,
    };

  if (entityName && utterances)
    return {
      prompt: `Generate ${quantity} ways to ask someone clarification if they are missing their "${intentName}". Here are some examples of an utterance that contains the slots: ${utterances}.  Do so for locale "${locale}". List the ${quantity} clarifications within a JSON array that is nested within a valid JSON object with a key "eg", like this { eg: string[] }.`,
      parser,
    };

  if (entityName)
    return {
      prompt: `Generate ${quantity} ways to ask someone clarification if they are missing their "${entityName}". Do so for locale "${locale}". List the ${quantity} clarifications within a JSON array that is nested within a valid JSON object with a key "eg", like this { eg: string[] }.`,
      parser,
    };

  throw new Error('invalid configuration');
};
