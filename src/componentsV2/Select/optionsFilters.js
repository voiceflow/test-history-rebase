import _shuffle from 'lodash/shuffle';

export const searchableOptionsFilter = (
  options,
  searchLabel,
  { maxSize = options.length, showNotMatched = true, getOptionLabel, getOptionValue } = {}
) => {
  const label = searchLabel.toLowerCase();

  const [matchedOptions, notMatchedOptions] = options.reduce(
    ([matched, notMatched], option) => {
      if (
        !label ||
        getOptionLabel(getOptionValue(option))
          .toLowerCase()
          .includes(label)
      ) {
        matched.push(option);
      } else {
        notMatched.push(option);
      }

      return [matched, notMatched];
    },
    [[], []]
  );

  let filteredOptions = matchedOptions;

  if (matchedOptions.length > maxSize) {
    filteredOptions = matchedOptions.slice(0, maxSize);
  } else if (showNotMatched && matchedOptions.length < maxSize) {
    filteredOptions = [...matchedOptions, ..._shuffle(notMatchedOptions)].slice(0, maxSize);
  }

  return { filteredOptions, matchedOptions, notMatchedOptions };
};

export const defaultOptionsFilter = (options, _, { maxSize = options.length } = {}) => {
  const filteredOptions = options.slice(0, maxSize);

  return { filteredOptions, matchedOptions: filteredOptions, notMatchedOptions: filteredOptions };
};
