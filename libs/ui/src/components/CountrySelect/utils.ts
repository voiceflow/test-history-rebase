import { stripAccents } from '../../utils/string';
import { isUIOnlyMenuItemOption } from '../NestedMenu';
import type { OptionsFilter } from '../Select';
import type { Country } from './countries';

const getMatchScore = (search: string, text: string, multiplier = 1) => {
  if (text === search) return 100 * multiplier;

  if (text.startsWith(search)) return 70 * multiplier;

  if (text.includes(search)) return 30 * multiplier;

  return 0;
};

export const filterAndSortOptions: OptionsFilter<Country, string> = (options, searchLabel, { maxSize }) => {
  if (!searchLabel)
    return { filteredOptions: options.slice(0, maxSize), matchedOptions: options, notMatchedOptions: [] };

  const matchedOptions: Country[] = [];
  const notMatchedOptions: Country[] = [];

  const strippedString = stripAccents(searchLabel).toLowerCase();

  for (const option of options) {
    if (isUIOnlyMenuItemOption(option)) continue;

    const { searchValue, searchAlternative } = option;

    const score = getMatchScore(strippedString, searchValue) + getMatchScore(strippedString, searchAlternative, 0.5);

    if (score) {
      const boostedOption = { ...option, booster: score + option.booster };
      matchedOptions.push(boostedOption);
    } else {
      notMatchedOptions.push(option);
    }
  }

  const sorted = matchedOptions.sort((a, b) => b.booster - a.booster);

  return { filteredOptions: sorted.slice(0, maxSize), matchedOptions: sorted, notMatchedOptions };
};
