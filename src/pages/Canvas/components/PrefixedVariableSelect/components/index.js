import { FlexApart } from '@/components/Flex';
import { SearchInput } from '@/components/Select/components';
import VariableSelect from '@/components/VariableSelect';
import { styled } from '@/hocs';

export { default as Prefix } from './Prefix';

export const Select = styled(VariableSelect)`
  flex: 1;

  ${SearchInput} {
    padding-left: 90px;
  }
`;

export const Container = styled(FlexApart)`
  position: relative;
`;
