import { convertToWord } from './number';

// eslint-disable-next-line import/prefer-default-export
export const createNextName = (prefix, items) => {
  let name = `${prefix}_${convertToWord(items.length + 1)}`;

  const nameExists = (target) => items.find((item) => item.name === target);
  while (nameExists(name)) {
    name = `new_${name}`;
  }

  return name;
};
