import { Input, SvgIcon } from '@voiceflow/ui';

import { styled } from '@/hocs';

export const SEARCH_INPUT_HEIGHT = 36;

const SearchInput = styled(Input).attrs({ icon: 'search', iconProps: { size: 16, color: '#6e849a' } })`
  min-height: ${SEARCH_INPUT_HEIGHT}px;
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  border: none !important;
  box-shadow: none !important;
  font-size: 13px;
  line-height: 18px;

  & input::placeholder {
    font-size: 13px;
  }

  ${SvgIcon.Container} {
    opacity: 0.65;
    color: #6e849a;
    margin-right: 10px;
  }
`;

export default SearchInput;
