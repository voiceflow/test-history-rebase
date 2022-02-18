import _shuffle from 'lodash/shuffle';

import type { GetOptionLabel, GetOptionValue, GroupedOption, MultiLevelOption } from './index';
import { isMenuItemOption, isUIOnlyMenuItemOption, UIOnlyMenuItemOption } from './utils';

export interface FilterResult<O> {
  matchedOptions: Array<O | UIOnlyMenuItemOption>;
  filteredOptions: Array<O | UIOnlyMenuItemOption>;
  notMatchedOptions: Array<O | UIOnlyMenuItemOption>;
}

const matchOption =
  <O, V>(searchLabel: undefined | string, getOptionLabel: GetOptionLabel<V>, getOptionValue: GetOptionValue<O, V>) =>
  (option?: O) => {
    const searchString = getOptionLabel(getOptionValue(option));

    return !searchLabel ? true : searchString?.toLowerCase()?.includes(searchLabel);
  };

const multilevelSearch = <O, V>(
  matched: Array<MultiLevelOption<O> | UIOnlyMenuItemOption>,
  notMatched: Array<MultiLevelOption<O> | UIOnlyMenuItemOption>,
  searchLabel: string | undefined,
  option: MultiLevelOption<O> | UIOnlyMenuItemOption,
  params: { getOptionLabel: GetOptionLabel<V>; getOptionValue: GetOptionValue<O, V> }
): void => {
  // ui elements can't be first or in a row
  if (isMenuItemOption(option) && isUIOnlyMenuItemOption(option)) {
    if (matched.length !== 0 && !(isMenuItemOption(matched[matched.length - 1]) && isUIOnlyMenuItemOption(matched[matched.length - 1]))) {
      matched.push(option);
    } else {
      notMatched.push(option);
    }
  } else if (matchOption(searchLabel, params.getOptionLabel, params.getOptionValue)(option)) {
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
  matched: Array<GroupedOption<O> | UIOnlyMenuItemOption>,
  notMatched: Array<GroupedOption<O> | UIOnlyMenuItemOption>,
  searchLabel: string | undefined,
  option: GroupedOption<O> | UIOnlyMenuItemOption,
  params: { getOptionLabel: GetOptionLabel<V>; getOptionValue: GetOptionValue<O, V> }
) => {
  const childOptions: Array<O | UIOnlyMenuItemOption> = [];

  if (!isUIOnlyMenuItemOption(option)) {
    option?.options?.forEach((option) => {
      // ui elements can't be first or in a row
      if (isMenuItemOption(option) && isUIOnlyMenuItemOption(option)) {
        if (
          childOptions.length !== 0 &&
          !(isMenuItemOption(childOptions[childOptions.length - 1]) && isUIOnlyMenuItemOption(childOptions[childOptions.length - 1]))
        ) {
          childOptions.push(option);
        }
      } else if (matchOption(searchLabel, params.getOptionLabel, params.getOptionValue)(option)) {
        childOptions.push(option);
      }
    });
  }

  if (childOptions?.length) {
    matched.push({ ...option, options: childOptions } as GroupedOption<O>);
  } else {
    notMatched.push(option);
  }
};

const simpleSearch = <O, V>(
  matched: Array<O | UIOnlyMenuItemOption>,
  notMatched: Array<O | UIOnlyMenuItemOption>,
  searchLabel: string | undefined,
  option: O | UIOnlyMenuItemOption,
  params: { getOptionLabel: GetOptionLabel<V>; getOptionValue: GetOptionValue<O, V> }
) => {
  if (!searchLabel) {
    matched.push(option);
    // ui elements can't be first or in a row
  } else if (isMenuItemOption(option) && isUIOnlyMenuItemOption(option)) {
    if (matched.length !== 0 && !(isMenuItemOption(matched[matched.length - 1]) && isUIOnlyMenuItemOption(matched[matched.length - 1]))) {
      matched.push(option);
    } else {
      notMatched.push(option);
    }
  } else if (matchOption(searchLabel, params.getOptionLabel, params.getOptionValue)(option)) {
    matched.push(option);
  } else {
    notMatched.push(option);
  }
};

export const searchableOptionsFilter = <O, V>(
  options: Array<O | UIOnlyMenuItemOption>,
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
): FilterResult<O> => {
  const [matchedOptions, notMatchedOptions] = options.reduce<[Array<O | UIOnlyMenuItemOption>, Array<O | UIOnlyMenuItemOption>]>(
    ([matched, notMatched], option) => {
      let searchFunction = simpleSearch;

      if (multiLevelDropdown && !isUIOnlyMenuItemOption(option) && (option as MultiLevelOption<O>).options?.length && searchLabel) {
        searchFunction = multilevelSearch;
      } else if (grouped && searchLabel) {
        searchFunction = groupedSearch;
      }

      searchFunction(matched, notMatched, searchLabel?.toLowerCase(), option, { getOptionLabel, getOptionValue });
      return [matched, notMatched];
    },
    [[], []]
  );

  if (isUIOnlyMenuItemOption(matchedOptions[0])) {
    matchedOptions.shift();
  }

  if (isUIOnlyMenuItemOption(matchedOptions[matchedOptions.length - 1])) {
    matchedOptions.pop();
  }

  let filteredOptions = matchedOptions;

  if (matchedOptions.length > maxSize) {
    filteredOptions = matchedOptions.slice(0, maxSize);
  } else if (showNotMatched && matchedOptions.length < maxSize) {
    filteredOptions = [...matchedOptions, ...(searchLabel ? _shuffle(notMatchedOptions) : notMatchedOptions)].slice(0, maxSize);
  }

  return { filteredOptions, matchedOptions, notMatchedOptions };
};

export const defaultOptionsFilter = <O>(
  options: Array<O | UIOnlyMenuItemOption>,
  _searchLabel: string | undefined,
  { maxSize = options.length } = {}
): FilterResult<O> => {
  const filteredOptions = options.slice(0, maxSize);

  return { filteredOptions, matchedOptions: filteredOptions, notMatchedOptions: filteredOptions };
};
