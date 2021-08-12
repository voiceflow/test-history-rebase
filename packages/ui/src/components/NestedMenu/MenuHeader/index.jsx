import React from 'react';

import Box from '../../Box';
import { MenuHeaderWrapper, MenuHr, MenuInput } from './components';

function MenuHeader({
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
  alwaysShowCreate,
  createInputPlaceholder,
  createLabel = 'Create',
}) {
  const value = searchable && !isDropdown ? searchLabel : newOptionLabel;
  const inputVal = searchable ? searchLabel : newOptionLabel;

  if (!inputVal && !alwaysShowCreate) return null;

  return (
    <>
      <MenuHeaderWrapper
        isDisabled={isButtonDisabled(value)}
        ref={focusedOptionIndex === 0 ? focusedOptionRef : null}
        isFocused={focusedOptionIndex === 0}
        onMouseEnter={onFocus}
        onClick={() => {
          if (value) {
            onCreate(value);
          }
        }}
      >
        {!isDropdown && <Box style={{ marginRight: '4px', color: '#6e849a' }}>{createLabel}</Box>}
        {inputVal && <>"</>}
        <MenuInput
          onClick={(e) => e.stopPropagation()}
          ref={createInputRef}
          value={inputVal}
          variant="inline"
          onChange={searchable ? onChangeSearchLabel : ({ target }) => updateSearchLabel(target.value)}
          placeholder={createInputPlaceholder}
        />
        {inputVal && <>"</>}
      </MenuHeaderWrapper>
      <MenuHr />
    </>
  );
}

export default MenuHeader;
