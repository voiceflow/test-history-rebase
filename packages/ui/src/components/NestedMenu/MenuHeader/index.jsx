import React from 'react';

import LegacyButton from '../../LegacyButton';
import { MenuHeaderWrapper, MenuHr, MenuInput, MenuSearchIcon } from './components';

function MenuHeader({
  withSearchIcon = true,
  onFocus,
  onCreate,
  searchable,
  isDropdown,
  searchLabel,
  createInputRef,
  newOptionLabel,
  focusedOptionRef,
  isButtonDisabled,
  updateSearchLabel,
  focusedOptionIndex,
  onChangeSearchLabel,
  createInputPlaceholder,
}) {
  const value = searchable && !isDropdown ? searchLabel : newOptionLabel;

  return (
    <>
      <MenuHeaderWrapper ref={focusedOptionIndex === 0 ? focusedOptionRef : null} isFocused={focusedOptionIndex === 0} onMouseEnter={onFocus}>
        {withSearchIcon && <MenuSearchIcon icon="search" color="#6E849A" />}

        <MenuInput
          ref={createInputRef}
          value={searchable ? searchLabel : newOptionLabel}
          variant="inline"
          onChange={searchable ? onChangeSearchLabel : ({ target }) => updateSearchLabel(target.value)}
          placeholder={createInputPlaceholder}
        />

        {!isDropdown && (
          <LegacyButton isBtn onClick={() => onCreate(value)} disabled={!value || isButtonDisabled(value)} className="pointer" isLinkLarge>
            Create
          </LegacyButton>
        )}
      </MenuHeaderWrapper>

      <MenuHr />
    </>
  );
}

export default MenuHeader;
