// eslint-disable-next-line you-dont-need-lodash-underscore/to-lower
import _toLower from 'lodash/toLower';
import React from 'react';

// eslint-disable-next-line import/prefer-default-export
export const getFormattedLabel = (label: string | null | undefined, searchLabel: string) => {
  const substrs = (searchLabel && _toLower(label ?? '')?.split(_toLower(searchLabel))) || [];

  if (substrs.length < 2 || !label) {
    return label;
  }

  const { res: strsToRender } = substrs.reduce<{ res: string[]; length: number }>(
    (acc, str, i) => {
      if (i === 0) {
        acc.res.push(label.substr(0, str.length));
        acc.length += str.length;
      } else {
        acc.res.push(label.substr(acc.length, searchLabel.length));
        acc.length += searchLabel.length;
        acc.res.push(label.substr(acc.length, str.length));
        acc.length += str.length;
      }

      return acc;
    },
    { res: [], length: 0 }
  );

  return strsToRender.map((str, i) => (i % 2 === 0 ? str : <b key={i}>{str}</b>));
};
