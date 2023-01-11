const ABBREVIATIONS: [number, string][] = [
  [0, ''],
  [10 ** 3, 'k'],
  [10 ** 6, 'M'],
  [10 ** 9, 'B'],
  [10 ** 12, 'T'],
];

export const abbreviateNumber = (value: string | number): string => {
  const numericValue = Number(value);
  let minAbbreviation: [number, string] | undefined;

  // eslint-disable-next-line no-restricted-syntax
  for (const abbreviation of ABBREVIATIONS) {
    if (abbreviation[0] <= numericValue) {
      minAbbreviation = abbreviation;
    } else {
      break;
    }
  }

  if (!minAbbreviation) return numericValue.toExponential(1);

  const [minimum, suffix] = minAbbreviation;
  if (!suffix) return String(numericValue);

  const abbreviated = numericValue / minimum;
  return `${abbreviated % 1 ? abbreviated.toFixed(1) : abbreviated}${suffix}`;
};
