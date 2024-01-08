import type { z, ZodTypeAny } from 'zod';

// T is the expected return object type
const parseString = <T extends ZodTypeAny>(str: string, markers: [string, string], dto: T): z.infer<T> => {
  try {
    if (str.indexOf(markers[0]) === -1) {
      return JSON.parse(`${markers[0]}${str}${markers[1]}`);
    }

    const result = JSON.parse(str.substring(str.indexOf(markers[0]), str.lastIndexOf(markers[1]) + 1));

    if (dto && !dto.safeParse(result).success) throw new Error();

    return result;
  } catch {
    throw new Error(`Failed to parse string: ${str}`);
  }
};

export const parseArrayString = <T extends ZodTypeAny>(str: string, dto: T): z.infer<T> => {
  return parseString<T>(str, ['[', ']'], dto);
};

export const parseObjectString = <T extends ZodTypeAny>(str: string, dto: T): z.infer<T> => {
  return parseString<T>(str, ['{', '}'], dto);
};

export const escapeQuotes = (text: string) => {
  return text.replace(/"/g, '\\"');
};

export const convertUtterances = (utterances: string[], max = 5) => {
  return utterances
    .map((utterance) => escapeQuotes(utterance.trim()))
    .filter(Boolean)
    .slice(0, max)
    .map((utterance) => `"${utterance}"`)
    .join(', ');
};
