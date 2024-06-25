import { styled } from '@ui/styles';
import React from 'react';

import { getFormattedLabel } from './getFormattedLabel';
import type { GetOptionLabel, GetOptionValue, RenderOptionLabelConfig, UIOnlyMenuItemOption } from './types';

const LabelWrapper = styled.span`
  text-overflow: ellipsis;
  line-height: 30px;
  overflow: hidden;
  white-space: nowrap;
`;

const defaultMenuLabelRenderer = <Option, Value>(
  option: Exclude<Option, UIOnlyMenuItemOption>,
  searchLabel: string,
  getOptionLabel: GetOptionLabel<Value>,
  getOptionValue: GetOptionValue<Option, Value>,

  _config?: RenderOptionLabelConfig
): React.ReactElement => {
  const label = getOptionLabel(getOptionValue(option));

  return <LabelWrapper>{typeof label === 'string' ? getFormattedLabel(label, searchLabel) : label}</LabelWrapper>;
};

export default defaultMenuLabelRenderer;
