// T is the expected return object type
const parseString = <T>(result: string, markers: [string, string]): T => {
  if (result.indexOf(markers[0]) === -1) {
    return JSON.parse(`${markers[0]}${result}${markers[1]}`);
  }

  return JSON.parse(result.substring(result.indexOf(markers[0]), result.lastIndexOf(markers[1]) + 1));
};

export const parseArrayString = <T>(result: string) => {
  return parseString<T>(result, ['[', ']']);
};

export const parseObjectString = <T>(result: string): T => {
  return parseString<T>(result, ['{', '}']);
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
