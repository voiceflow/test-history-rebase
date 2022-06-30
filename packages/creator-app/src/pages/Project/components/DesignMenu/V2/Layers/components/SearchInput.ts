import { Input, SvgIcon } from '@voiceflow/ui';

import { styled } from '@/hocs';

export const SEARCH_INPUT_HEIGHT = 25;

const SearchInput = styled(Input).attrs({ icon: 'search', iconProps: { size: 16, color: '#6e849a' } })`
  min-height: ${SEARCH_INPUT_HEIGHT}px;
  padding: 7px 0 0 0;
  border-radius: 0;
  border: none !important;
  box-shadow: none !important;
  font-size: 13px;
  line-height: 18px;

  ${SvgIcon.Container} {
    margin-right: 10px;
  }
`;

export default SearchInput;
