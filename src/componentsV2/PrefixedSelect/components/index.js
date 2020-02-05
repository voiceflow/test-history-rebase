import { FlexApart } from '@/componentsV2/Flex';
import Select from '@/componentsV2/Select';
import { SearchInput } from '@/componentsV2/Select/components';
import { styled } from '@/hocs';

export { default as Prefix } from './Prefix';

export const SelectInput = styled(Select)`
  flex: 1;

  ${SearchInput} {
    padding-left: ${({ offset = 0 }) => offset}px;
  }
`;

export const Container = styled(FlexApart)`
  position: relative;
`;
