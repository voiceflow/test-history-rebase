import { Input } from '@voiceflow/ui';

import { searchIcon } from '@/assets';
import { styled } from '@/styles';

const SearchInput = styled(Input)`
  padding-left: 44px !important;
  color: #132144 !important;
  background-image: url(${searchIcon}) !important;
  background-repeat: no-repeat !important;
  background-position: 16px center !important;
  background-size: auto 38% !important;

  :focus {
    border: 1px solid #5d9df5 !important;
    box-shadow: none !important;
  }
`;

export default SearchInput;
