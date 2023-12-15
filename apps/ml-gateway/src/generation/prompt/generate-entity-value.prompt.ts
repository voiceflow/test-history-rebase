import dedent from 'dedent';
import { z } from 'nestjs-zod/z';

import { convertUtterances, parseArrayString, parseObjectString } from '../generation.util';

export const getEntityValuePrompt = ({
  quantity,
  name,
  type,
  examples,
  locale = 'en-US',
}: {
  name?: string;
  type: string;
  examples?: string[];
  quantity: number;
  locale?: string;
}) => {
  const utterances = convertUtterances(examples || []);

  if (type.toLocaleLowerCase() === 'custom' && name) {
    return {
      prompt: dedent`You are generating a valid JSON object for locale "${locale}". Generate ${quantity} slot values for the slot type: ${name}.
      The keys should be the slot values, the values should be an array of 3 synonyms of the slot values. Follow this typescript format: Record<string, string[]>. Each synonym should be unique.`,
      parser: (output: string) =>
        Object.entries(parseObjectString(output, z.record(z.array(z.string())))).reduce<string[][]>(
          (acc, [key, value]) => [...acc, [key, ...value]],
          []
        ),
    };
  }

  const parser = (output: string) => parseArrayString(output, z.array(z.string())).map((value) => [value]);

  if (name && type) {
    return {
      prompt: `Give ${quantity} examples of a slot called ${name} of type "${type}" in locale ${locale}. Return a single JSON array: string[].`,
      parser,
    };
  }

  if (examples?.length) {
    return {
      prompt: `Give ${quantity} examples of a slot with type "${type}" in locale ${locale}. Some existing examples include: ${utterances}, do not repeat any existing examples. Return a single JSON array: string[].`,
      parser,
    };
  }

  return {
    prompt: `Give ${quantity} examples of a slot with type "${type}" in locale ${locale}. Return a single JSON array: string[].`,
    parser,
  };
};
