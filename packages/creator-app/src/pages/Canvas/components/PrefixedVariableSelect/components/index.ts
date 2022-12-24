import { FlexApart, SearchInput } from '@voiceflow/ui';

import VariableSelect from '@/components/VariableSelect';
import { styled } from '@/hocs/styled';

export { default as Prefix } from './Prefix';

export const Select = styled(VariableSelect)`
  flex: 1;

  ${SearchInput} {
    padding-bottom: 12px;
    padding-left: 90px;
  }
`;

export const Container = styled(FlexApart)`
  position: relative;
`;
