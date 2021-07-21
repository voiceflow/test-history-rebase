import React from 'react';

import { getFormattedLabel } from './getFormattedLabel';

const defaultMenuLabelRenderer = <O, V>(
  option: O,
  searchLabel: string,
  getOptionLabel: (value?: V) => string | undefined | null,
  getOptionValue: (option?: O) => V | undefined,
  _config: { isFocused: boolean; optionsPath: number[] }
) => {
  const label = getOptionLabel(getOptionValue(option));

  return <span>{getFormattedLabel(label, searchLabel)}</span>;
};

export default defaultMenuLabelRenderer;
