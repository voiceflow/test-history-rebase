import _toLower from 'lodash/toLower';
import React from 'react';

const getFormatedLabel = (label, searchLabel) => {
  const substrs = (searchLabel && _toLower(label)?.split(_toLower(searchLabel))) || [];

  if (substrs.length < 2) {
    return label;
  }

  const { res: strsToRender } = substrs.reduce(
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

const defaultLabelRenderer = (option, searchLabel, getOptionLabel, getOptionValue) => {
  const label = getOptionLabel(getOptionValue(option));

  return <span>{getFormatedLabel(label, searchLabel)}</span>;
};

export default defaultLabelRenderer;
