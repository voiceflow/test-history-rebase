import React from 'react';

const defaultLabelFormatted = (label: string): string => label.toLowerCase();

export const getFormattedLabel = (
  label: React.ReactNode | null = '',
  searchLabel: string | null = '',
  formatLabel: (label: string) => string = defaultLabelFormatted
): React.ReactNode => {
  if (!label || !searchLabel || typeof label !== 'string') {
    return label;
  }

  const formattedLabel = formatLabel(label);
  const substrings = formattedLabel.split(searchLabel.toLowerCase());

  if (substrings.length < 2) {
    return label;
  }

  const { result } = substrings.reduce<{ result: string[]; shift: number }>(
    (acc, str, index) => {
      if (index === 0) {
        acc.result.push(label.substring(index, str.length));
        acc.shift += str.length;
      } else {
        acc.result.push(label.substring(acc.shift, acc.shift + searchLabel.length));
        acc.shift += searchLabel.length;
        acc.result.push(label.substring(acc.shift, acc.shift + str.length));
        acc.shift += str.length;
      }

      return acc;
    },
    { result: [], shift: 0 }
  );

  return result.map((str, index) => (index % 2 === 0 ? str : <b key={index}>{str}</b>));
};
