import get from 'lodash/get';
import trim from 'lodash/trim';
import split from 'lodash/split';

export const text = (str, defaultValue = '') => str || defaultValue;

export const getText = (obj, key, defaultValue = '') => get(obj, key, defaultValue);

export const transformBoolToStr = (bool, yes = 'Yes', no = 'No') => (bool ? yes : no);

export const beautifySeparatedStrings = (str, splitBy) =>
  split(str, splitBy)
    .map(trim)
    .filter(s => !!s)
    .join(', ');

export const htmlToText = html => {
  const template = document.createElement('div');

  template.innerHTML = html;

  return (template.innerText && template.innerText.trim()) || html;
};
