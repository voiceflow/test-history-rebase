import { READABLE_VARIABLE_REGEXP } from '@voiceflow/common';

export const rawTextToUtteranceFormat = (text = '', slotsMap: Record<string, string>) => {
  const matches = [...text.matchAll(READABLE_VARIABLE_REGEXP)];
  if (matches.length === 0) {
    return text;
  }

  let transformedText = text;
  const utteranceSlots = new Set();

  matches.forEach((match) => {
    const name = match[1];
    const slotID = slotsMap[name];
    utteranceSlots.add(slotID);
    transformedText = text.replace(`{${name}}`, `{{[${name}].${slotID}}}`);
  });
  return {
    text: transformedText,
    utteranceSlots: [...utteranceSlots] as string[],
  };
};
