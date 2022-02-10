import Box from '@ui/components/Box';
import SvgIcon from '@ui/components/SvgIcon';
import { stopImmediatePropagation } from '@ui/utils';
import React from 'react';

import { MenuHeaderWrapper, MenuHr, MenuInput, SearchContainer } from './components';

// eslint-disable-next-line sonarjs/cognitive-complexity
function MenuHeader({
  onFocus,
  onCreate,
  searchable,
  creatable,
  hasOptions,
  isDropdown,
  searchLabel,
  createInputRef,
  newOptionLabel,
  focusedOptionRef,
  isButtonDisabled,
  updateSearchLabel,
  focusedOptionIndex,
  inDropdownSearch,
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
      {inDropdownSearch && (
        <>
          <SearchContainer onClick={stopImmediatePropagation(() => {})}>
            <Box mr={12}>
              <SvgIcon icon="search" size={16} color="#6E849A" />
            </Box>
            <MenuInput
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              ref={inDropdownSearch ? createInputRef : null}
              value={inputVal}
              onClick={() => createInputRef.current.focus()}
              onChange={searchable ? onChangeSearchLabel : ({ target }) => updateSearchLabel(target.value)}
              placeholder={`Search ${createInputPlaceholder}`}
            />
          </SearchContainer>
          <MenuHr />
        </>
      )}

      {(!inDropdownSearch || (value && creatable)) && (
        <MenuHeaderWrapper
          isDisabled={isButtonDisabled(value)}
          ref={focusedOptionIndex === 0 ? focusedOptionRef : null}
          isFocused={focusedOptionIndex === 0}
          onMouseEnter={onFocus}
          onClick={() => value && onCreate(value)}
        >
          {!isDropdown && <Box style={{ marginRight: '4px', color: '#6e849a' }}>{createLabel}</Box>}

          {inputVal && <>"</>}

          <MenuInput
            onClick={(e) => {
              if (!inDropdownSearch) {
                e.stopPropagation();
              }
            }}
            inDropdownSearch={inDropdownSearch}
            ref={inDropdownSearch ? null : createInputRef}
            value={inputVal}
            variant="inline"
            onChange={searchable ? onChangeSearchLabel : ({ target }) => updateSearchLabel(target.value)}
            placeholder={createInputPlaceholder}
          />

          {inputVal && <>"</>}
        </MenuHeaderWrapper>
      )}

      {!inDropdownSearch && hasOptions && <MenuHr style={{ margin: '0px' }} />}
    </>
  );
}

export default MenuHeader;
