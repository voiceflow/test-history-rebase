import { SvgIcon, TippyTooltip, useOnClickOutside } from '@voiceflow/ui';
import React from 'react';

import { IconButtonContainer, SearchBox, SearchInput } from '../styles';

interface SearchButtonProps {
  onSearch: (text: string) => void;
}

const SearchButton: React.FC<SearchButtonProps> = ({ onSearch }) => {
  const ref = React.useRef(null);
  const [isOpen, setOpen] = React.useState(false);
  const [hasTyped, setHasTyped] = React.useState(false);

  useOnClickOutside(
    ref,
    () => {
      setHasTyped(false);
      setOpen(false);
      onSearch('');
    },
    []
  );

  const onIconClick = () => {
    setOpen(true);
  };

  const onSearching = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!hasTyped) setHasTyped(true);
    onSearch(e.target.value);
  };

  const clearSearch = () => {
    onSearch('');
  };

  return (
    <>
      {isOpen ? (
        <SearchBox ref={ref}>
          <div style={{ paddingRight: '8px' }}>
            <SvgIcon icon={hasTyped ? 'close' : 'search'} size={16} color="rgba(110, 132, 154, 0.85)" onClick={hasTyped ? clearSearch : undefined} />
          </div>
          <SearchInput placeholder="Search" onChange={onSearching} />
        </SearchBox>
      ) : (
        <IconButtonContainer>
          <TippyTooltip title="Press / to search" position="bottom">
            <SvgIcon icon="search" size={16} onClick={onIconClick} />
          </TippyTooltip>
        </IconButtonContainer>
      )}
    </>
  );
};

export default SearchButton;
