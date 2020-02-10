import _shuffle from 'lodash/shuffle';

const matchOption = (label, getOptionLabel, getOptionValue) => (option) =>
  getOptionLabel(getOptionValue(option))
    ?.toLowerCase()
    ?.includes(label?.toLowerCase());

const multilevelSearch = (matched, notMatched, searchLabel, option, params) => {
  if (matchOption(searchLabel, params.getOptionLabel, params.getOptionValue)(option)) {
    matched.push(option);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const { matchedOptions } = searchableOptionsFilter(option.options, searchLabel, params);

    if (matchedOptions.length) {
      matched.push({ ...option, options: matchedOptions });
    } else {
      notMatched.push(option);
    }
  }
};

const groupedSearch = (matched, notMatched, searchLabel, option, params) => {
  const childOptions = option?.options.filter(matchOption(searchLabel, params.getOptionLabel, params.getOptionValue));

  if (childOptions.length) {
    matched.push({ ...option, options: childOptions });
  } else {
    notMatched.push(option);
  }
};

const simpleSearch = (matched, notMatched, searchLabel, option, params) => {
  if (!searchLabel || matchOption(searchLabel, params.getOptionLabel, params.getOptionValue)(option)) {
    matched.push(option);
  } else {
    notMatched.push(option);
  }
};

export const searchableOptionsFilter = (
  options,
  searchLabel,
  { grouped = false, maxSize = options.length, getOptionLabel, getOptionValue, multiLevelDropdown = false, showNotMatched = !multiLevelDropdown } = {}
) => {
  const [matchedOptions, notMatchedOptions] = options.reduce(
    ([matched, notMatched], option) => {
      let searchFunction = simpleSearch;

      if (multiLevelDropdown && option.options && searchLabel) {
        searchFunction = multilevelSearch;
      } else if (grouped && searchLabel) {
        searchFunction = groupedSearch;
      }

      searchFunction(matched, notMatched, searchLabel, option, {
        grouped,
        maxSize,
        showNotMatched,
        getOptionLabel,
        getOptionValue,
        multiLevelDropdown,
      });

      return [matched, notMatched];
    },
    [[], []]
  );

  let filteredOptions = matchedOptions;

  if (matchedOptions.length > maxSize) {
    filteredOptions = matchedOptions.slice(0, maxSize);
  } else if (showNotMatched && matchedOptions.length < maxSize) {
    filteredOptions = [...matchedOptions, ...(searchLabel ? _shuffle(notMatchedOptions) : notMatchedOptions)].slice(0, maxSize);
  }

  return { filteredOptions, matchedOptions, notMatchedOptions };
};

export const defaultOptionsFilter = (options, _, { maxSize = options.length } = {}) => {
  const filteredOptions = options.slice(0, maxSize);

  return { filteredOptions, matchedOptions: filteredOptions, notMatchedOptions: filteredOptions };
};
