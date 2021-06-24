import { Input } from '@voiceflow/ui';

import { styled } from '@/hocs';

const SearchInput = styled(Input)`
  border: none !important;
  box-shadow: none !important;

  &::placeholder {
    line-height: 22px;
  }
`;

export default SearchInput;
