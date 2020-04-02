import React from 'react';

import Button from '@/components/LegacyButton';

import { MenuHeaderWrapper, MenuHr, MenuInput, MenuSearchIcon } from './components';

function MenuHeader({
  onFocus,
  onCreate,
  searchLabel,
  createInputRef,
  menuSearchable,
  newOptionLabel,
  focusedOptionRef,
  isButtonDisabled,
  updateSearchLabel,
  focusedOptionIndex,
  onChangeSearchLabel,
  createInputPlaceholder,
}) {
  return (
    <>
      <MenuHeaderWrapper
        ref={focusedOptionIndex === 0 ? focusedOptionRef : null}
        isFocused={focusedOptionIndex === 0}
        searchable={menuSearchable}
        onMouseEnter={onFocus}
      >
        <MenuSearchIcon icon="search" color="#6E849A" />

        <MenuInput
          ref={createInputRef}
          value={menuSearchable ? searchLabel : newOptionLabel}
          variant="inline"
          onChange={menuSearchable ? onChangeSearchLabel : ({ target }) => updateSearchLabel(target.value)}
          placeholder={createInputPlaceholder}
        />

        {!menuSearchable && (
          <Button
            isBtn
            onClick={() => onCreate(newOptionLabel)}
            disabled={!newOptionLabel || isButtonDisabled(newOptionLabel)}
            className="pointer"
            isLinkLarge
          >
            Create
          </Button>
        )}
      </MenuHeaderWrapper>

      <MenuHr />
    </>
  );
}

export default MenuHeader;
