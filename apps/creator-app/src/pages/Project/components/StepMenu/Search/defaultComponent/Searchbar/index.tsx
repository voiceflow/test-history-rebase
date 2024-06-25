import { Utils } from '@voiceflow/common';
import { Box, stopImmediatePropagation } from '@voiceflow/ui';
import React from 'react';

import { MenuInput, SearchContainer, StyledSvgIcon, StyledSvgIconContainer } from './components';

interface SearchbarProps {
  /**
   * The search text in the search bar
   */
  value: string;

  /**
   * Called whenever the search text updates.
   */
  onSearch: (newSearchText: string) => void;

  /**
   * Called whenever the cancel button is triggered.
   */
  onCancel: VoidFunction;

  /**
   * Placeholder text to display if input is empty. Defaults to `'Search'`
   */
  placeholder?: string;
}

const Searchbar: React.FC<SearchbarProps> = ({ value, placeholder = 'Search', onSearch, onCancel }) => {
  const isInputEmpty = !value;

  return (
    <SearchContainer onClick={stopImmediatePropagation()}>
      <Box mr={12} display="inline-block">
        <StyledSvgIconContainer>
          <StyledSvgIcon
            icon={isInputEmpty ? 'search' : 'close'}
            isInputEmpty={isInputEmpty}
            onClick={isInputEmpty ? Utils.functional.noop : onCancel}
            size={16}
            color="#6E849A"
          />
        </StyledSvgIconContainer>
      </Box>

      <MenuInput
        value={value}
        onChange={({ target }) => onSearch(target.value)}
        autoFocus
        $fullWidth
        placeholder={placeholder}
      />
    </SearchContainer>
  );
};

export default Searchbar;
