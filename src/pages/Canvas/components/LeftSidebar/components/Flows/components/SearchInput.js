import Input from '@/components/Input';
import { styled } from '@/hocs';

const SearchInput = styled(Input)`
  border: none !important;
  box-shadow: none !important;

  &::placeholder {
    line-height: 22px;
  }
`;

export default SearchInput;
