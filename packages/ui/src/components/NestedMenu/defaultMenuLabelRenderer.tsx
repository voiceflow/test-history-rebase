import React from 'react';

import { styled } from '../../styles';
import { getFormattedLabel } from './getFormattedLabel';

const LabelWrapper = styled.span`
  text-overflow: ellipsis;
  line-height: 30px;
  overflow: hidden;
  white-space: nowrap;
`;

const defaultMenuLabelRenderer = <O, V>(
  option: O,
  searchLabel: string,
  getOptionLabel: (value?: V) => string | undefined | null,
  getOptionValue: (option?: O) => V | undefined,
  _config: { isFocused: boolean; optionsPath: number[] }
) => {
  const label = getOptionLabel(getOptionValue(option));

  return <LabelWrapper>{getFormattedLabel(label, searchLabel)}</LabelWrapper>;
};

export default defaultMenuLabelRenderer;
