import { convertToWord } from './number';

export const createNextName = (prefix, items) => {
  let name = `${prefix}_${convertToWord(items.length + 1)}`;

  const nameExists = (target) => items.find((item) => item.name === target);
  while (nameExists(name)) {
    name = `new_${name}`;
  }

  return name;
};

export const capitalizeFirstLetter = (value) => value.charAt(0).toUpperCase() + value.slice(1);
