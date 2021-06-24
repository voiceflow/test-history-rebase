import _shuffle from 'lodash/shuffle';

import type { GetOptionLabel, GetOptionValue, GroupedOption, MultiLevelOption } from './index';

const matchOption =
  <O, V>(label: undefined | string, getOptionLabel: GetOptionLabel<V>, getOptionValue: GetOptionValue<O, V>) =>
  (option?: O & { label?: string }) => {
    const searchString = getOptionLabel(getOptionValue(option));
    return searchString?.toLowerCase()?.includes(label?.toLowerCase() ?? '');
  };

const multilevelSearch = <O, V>(
  matched: MultiLevelOption<O>[],
  notMatched: MultiLevelOption<O>[],
  searchLabel: string | undefined,
  option: MultiLevelOption<O>,
  params: { getOptionLabel: GetOptionLabel<V>; getOptionValue: GetOptionValue<O, V> }
) => {
  if (matchOption(searchLabel, params.getOptionLabel, params.getOptionValue)(option)) {
    matched.push(option);
  } else {
    const { matchedOptions } = searchableOptionsFilter(option.options ?? [], searchLabel, { ...params, multiLevelDropdown: true });
    if (matchedOptions.length) {
      matched.push({ ...option, options: matchedOptions });
    } else {
      notMatched.push(option);
    }
  }
};

const groupedSearch = <O, V>(
  matched: GroupedOption<O>[],
  notMatched: GroupedOption<O>[],
  searchLabel: string | undefined,
  option: GroupedOption<O>,
  params: { getOptionLabel: GetOptionLabel<V>; getOptionValue: GetOptionValue<O, V> }
) => {
  const childOptions = option?.options?.filter(matchOption(searchLabel, params.getOptionLabel, params.getOptionValue));

  if (childOptions?.length) {
    matched.push({ ...option, options: childOptions });
  } else {
    notMatched.push(option);
  }
};

const simpleSearch = <O, V>(
  matched: O[],
  notMatched: O[],
  searchLabel: string | undefined,
  option: O,
  params: { getOptionLabel: GetOptionLabel<V>; getOptionValue: GetOptionValue<O, V> }
) => {
  if (!searchLabel || matchOption(searchLabel, params.getOptionLabel, params.getOptionValue)(option)) {
    matched.push(option);
  } else {
    notMatched.push(option);
  }
};

export const searchableOptionsFilter = <O, V>(
  options: O[],
  searchLabel: string | undefined,
  {
    grouped = false,
    maxSize = options.length,
    getOptionLabel,
    getOptionValue,
    multiLevelDropdown = false,
    showNotMatched = !multiLevelDropdown,
  }: {
    grouped?: boolean;
    maxSize?: number;
    getOptionLabel: GetOptionLabel<V>;
    getOptionValue: GetOptionValue<O, V>;
    showNotMatched?: boolean;
    multiLevelDropdown?: boolean;
  }
) => {
  const [matchedOptions, notMatchedOptions] = options.reduce<[O[], O[]]>(
    ([matched, notMatched], option) => {
      let searchFunction = simpleSearch;

      if (multiLevelDropdown && (option as MultiLevelOption<O>).options && searchLabel) {
        searchFunction = multilevelSearch;
      } else if (grouped && searchLabel) {
        searchFunction = groupedSearch;
      }

      searchFunction(matched, notMatched, searchLabel, option, { getOptionLabel, getOptionValue });
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

export const defaultOptionsFilter = <O>(options: O[], _searchLabel: string | undefined, { maxSize = options.length } = {}) => {
  const filteredOptions = options.slice(0, maxSize);

  return { filteredOptions, matchedOptions: filteredOptions, notMatchedOptions: filteredOptions };
};
