import SearchInput from '@ui/components/SearchInput';
import Select from '@ui/components/Select';
import { styled } from '@ui/styles';

export const StyledSelect = styled(Select)`
  ${SearchInput} {
    text-align: right;
  }
` as typeof Select;
