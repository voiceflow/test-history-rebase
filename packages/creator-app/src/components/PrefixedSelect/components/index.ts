import { FlexApart, SearchInput, Select, SelectProps } from '@voiceflow/ui';
import React from 'react';

import { styled } from '@/hocs';

export { default as Prefix } from './Prefix';

export const SelectInput = styled<React.FC<SelectProps<any, any>>>(Select)<{ offset?: number }>`
  flex: 1;

  ${SearchInput} {
    padding-left: ${({ offset = 0 }) => offset}px;
  }
`;

export const Container = styled(FlexApart)`
  position: relative;
`;
