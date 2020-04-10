import { convertToWord } from './number';

export const createNextName = (prefix: string, items: string[]) => {
  let counter = 1;
  while (items.includes(`${prefix}_${convertToWord(counter)}`)) {
    counter++;
  }
  return `${prefix}_${convertToWord(counter)}`;
};

const replacer = (match: string, inner: string, variables: Record<string, any>, modifier?: Function) => {
  if (inner in variables) {
    return modifier?.(variables[inner]) ?? variables[inner];
  }
  return match;
};

export const regexVariables = (phrase: string, variables: Record<string, any>, modifier?: Function) => {
  if (!phrase || !phrase.trim()) return '';

  return phrase.replace(/{(\w{1,32})}/g, (match, inner) => replacer(match, inner, variables, modifier));
};

export const capitalizeFirstLetter = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
