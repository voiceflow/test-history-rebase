import SearchInput from '@/components/SearchInput';
import Select from '@/components/Select';
import { styled } from '@/styles';

export const StyledSelect = styled(Select)`
  ${SearchInput} {
    text-align: right;
  }
` as typeof Select;
