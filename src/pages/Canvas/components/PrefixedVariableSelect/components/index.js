import { FlexApart } from '@/componentsV2/Flex';
import { SearchInput } from '@/componentsV2/Select/components';
import VariableSelect from '@/componentsV2/VariableSelect';
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
