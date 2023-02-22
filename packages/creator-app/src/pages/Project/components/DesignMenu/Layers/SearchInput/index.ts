import { Input, SvgIcon } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

import { SEARCH_INPUT_HEIGHT } from '../constants';

interface SearchInputProps {
  // styled-components props started with $ isn't passed to the Input component
  $onIconClick?: VoidFunction;
}

const SearchInput = styled(Input).attrs<SearchInputProps>(({ value, $onIconClick }) => ({
  icon: value ? 'close' : 'search',
  iconProps: {
    size: 16,
    color: '#6e849a',
    clickable: !!value,
    onClick: value ? $onIconClick : undefined,
    style: { opacity: value ? undefined : 0.65 },
  },
}))<SearchInputProps>`
  height: ${SEARCH_INPUT_HEIGHT}px;
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
    margin-right: 10px;
  }
`;

export default SearchInput;
