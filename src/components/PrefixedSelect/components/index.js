import { FlexApart } from '@/components/Flex';
import Select from '@/components/Select';
import { SearchInput } from '@/components/Select/components';
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
