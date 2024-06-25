import _shuffle from 'lodash/shuffle';

import type {
  GetOptionLabel,
  GetOptionValue,
  MenuItemGrouped,
  MenuItemMultilevel,
  UIOnlyMenuItemOption,
} from '../NestedMenu';
import { isMenuItemOption, isUIOnlyMenuItemOption } from '../NestedMenu/utils';
import type { FilterResult } from './types';

interface Params<Option, Value> {
  getOptionLabel: GetOptionLabel<Value>;
  getOptionValue: GetOptionValue<Option, Value>;
}

const matchOption =
  <Option, Value>(
    searchLabel: undefined | string,
    getOptionLabel: GetOptionLabel<Value>,
    getOptionValue: GetOptionValue<Option, Value>
  ) =>
  (option?: Option) => {
    if (!searchLabel) return true;

    const searchString = getOptionLabel(getOptionValue(option));

    if (typeof searchString !== 'string') return false;

    return searchString.toLowerCase().includes(searchLabel);
  };

const multilevelSearch = <Option, Value>(
  matched: Array<MenuItemMultilevel<Option> | UIOnlyMenuItemOption>,
  notMatched: Array<MenuItemMultilevel<Option> | UIOnlyMenuItemOption>,
  searchLabel: string | undefined,
  option: MenuItemMultilevel<Option> | UIOnlyMenuItemOption,
  params: Params<Option, Value>
): void => {
  // ui elements can't be first or in a row
  if (isMenuItemOption(option) && isUIOnlyMenuItemOption(option)) {
    if (
      matched.length !== 0 &&
      !(isMenuItemOption(matched[matched.length - 1]) && isUIOnlyMenuItemOption(matched[matched.length - 1]))
    ) {
      matched.push(option);
    } else {
      notMatched.push(option);
    }
  } else if (matchOption(searchLabel, params.getOptionLabel, params.getOptionValue)(option as Option)) {
    matched.push(option);
  } else {
    const { matchedOptions } = searchableOptionsFilter(option.options ?? [], searchLabel, {
      ...params,
      isMultiLevel: true,
    });

    if (matchedOptions.length) {
      matched.push({ ...option, options: matchedOptions });
    } else {
      notMatched.push(option);
    }
  }
};

const groupedSearch = <Option, Value>(
  matched: Array<MenuItemGrouped<Option | UIOnlyMenuItemOption> | UIOnlyMenuItemOption>,
  notMatched: Array<MenuItemGrouped<Option | UIOnlyMenuItemOption> | UIOnlyMenuItemOption>,
  searchLabel: string | undefined,
  option: MenuItemGrouped<Option | UIOnlyMenuItemOption> | UIOnlyMenuItemOption,
  params: Params<Option, Value>
) => {
  const childOptions: Array<Option | UIOnlyMenuItemOption> = [];

  if (!isUIOnlyMenuItemOption(option)) {
    option?.options?.forEach((option) => {
      // ui elements can't be first or in a row
      if (isMenuItemOption(option) && isUIOnlyMenuItemOption(option)) {
        if (
          childOptions.length !== 0 &&
          !(
            isMenuItemOption(childOptions[childOptions.length - 1]) &&
            isUIOnlyMenuItemOption(childOptions[childOptions.length - 1])
          )
        ) {
          childOptions.push(option);
        }
      } else if (matchOption(searchLabel, params.getOptionLabel, params.getOptionValue)(option)) {
        childOptions.push(option);
      }
    });
  }

  if (childOptions?.length) {
    matched.push({ ...option, options: childOptions } as MenuItemGrouped<Option | UIOnlyMenuItemOption>);
  } else {
    notMatched.push(option);
  }
};

const simpleSearch = <Option, Value>(
  matched: Array<Option | UIOnlyMenuItemOption>,
  notMatched: Array<Option | UIOnlyMenuItemOption>,
  searchLabel: string | undefined,
  option: Option | UIOnlyMenuItemOption,
  params: Params<Option, Value>
) => {
  if (!searchLabel) {
    matched.push(option);
    // ui elements can't be first or in a row
  } else if (isMenuItemOption(option) && isUIOnlyMenuItemOption(option)) {
    if (
      matched.length !== 0 &&
      !(isMenuItemOption(matched[matched.length - 1]) && isUIOnlyMenuItemOption(matched[matched.length - 1]))
    ) {
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

export const searchableOptionsFilter = <Option, Value>(
  options: Array<Option | UIOnlyMenuItemOption>,
  searchLabel: string | undefined,
  {
    grouped = false,
    maxSize = options.length,
    isMultiLevel = false,
    getOptionLabel,
    getOptionValue,
    showNotMatched = !isMultiLevel,
  }: {
    grouped?: boolean;
    maxSize?: number;
    isMultiLevel?: boolean;
    getOptionLabel: GetOptionLabel<Value>;
    getOptionValue: GetOptionValue<Option, Value>;
    showNotMatched?: boolean;
  }
): FilterResult<Option> => {
  const [matchedOptions, notMatchedOptions] = options.reduce<
    [Array<Option | UIOnlyMenuItemOption>, Array<Option | UIOnlyMenuItemOption>]
  >(
    ([matched, notMatched], option) => {
      let searchFunction = simpleSearch;

      if (
        isMultiLevel &&
        !isUIOnlyMenuItemOption(option) &&
        (option as MenuItemMultilevel<Option>).options?.length &&
        searchLabel
      ) {
        searchFunction = multilevelSearch as typeof simpleSearch;
      } else if (grouped && searchLabel) {
        searchFunction = groupedSearch as typeof simpleSearch;
      }

      searchFunction(matched, notMatched, searchLabel?.toLowerCase(), option, { getOptionLabel, getOptionValue });
      return [matched, notMatched];
    },
    [[], []]
  );

  const firstOption = matchedOptions[0];

  if (isUIOnlyMenuItemOption(firstOption) && !firstOption.groupHeader) {
    matchedOptions.shift();
  }

  if (isUIOnlyMenuItemOption(matchedOptions[matchedOptions.length - 1])) {
    matchedOptions.pop();
  }

  let filteredOptions = matchedOptions;

  if (matchedOptions.length > maxSize) {
    filteredOptions = matchedOptions.slice(0, maxSize);
  } else if (showNotMatched && matchedOptions.length < maxSize) {
    filteredOptions = [...matchedOptions, ...(searchLabel ? _shuffle(notMatchedOptions) : notMatchedOptions)].slice(
      0,
      maxSize
    );
  }

  return { filteredOptions, matchedOptions, notMatchedOptions };
};

export const defaultOptionsFilter = <Option>(
  options: Array<Option | UIOnlyMenuItemOption>,
  _searchLabel: string | undefined,
  { maxSize = options.length } = {}
): FilterResult<Option> => {
  const filteredOptions = options.slice(0, maxSize);

  return { filteredOptions, matchedOptions: filteredOptions, notMatchedOptions: filteredOptions };
};
